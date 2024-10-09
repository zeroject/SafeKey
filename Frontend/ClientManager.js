const os = require('os');
const net = require('net');
const { ipcMain } = require('electron');

class ClientManager {
  constructor() {
    this.loginClient = null;
    this.encryptClient = null;
    this.decryptClient = null;

    // Promises to track readiness of each client
    this.loginReady = null;
    this.encryptReady = null;
    this.decryptReady = null;
  }

  /**
   * Initializes all clients and returns a promise that resolves when all are ready.
   */
  initClient() {
    const loginPipeURL = this._getPipeURL('LoginPipe');
    const decryptPipeURL = this._getPipeURL('DecryptPipe');

    this.loginReady = this.initLoginClient(loginPipeURL);
    this.decryptReady = this.initDecryptClient(decryptPipeURL);

    return Promise.all([this.loginReady, this.decryptReady])
      .then(() => {
        console.log('All clients are connected and ready.');
      })
      .catch((err) => {
        console.error('One or more clients failed to initialize:', err);
      });
  }

  /**
   * Constructs the pipe URL based on the platform.
   * @param {string} pipeName - The name of the pipe.
   * @returns {string} - The full pipe URL.
   */
  _getPipeURL(pipeName) {
    return os.platform() === 'win32'
      ? `\\\\.\\pipe\\${pipeName}`
      : `/tmp/${pipeName}.sock`;
  }

  /**
   * Initializes the Login client.
   * @param {string} pipeURL - The pipe URL to connect to.
   * @returns {Promise} - Resolves when connected, rejects on error.
   */
  initLoginClient(pipeURL) {
    return this.connectWithRetry(() => new Promise((resolve, reject) => {
      this.loginClient = net.createConnection(pipeURL, () => {
        console.log('Connected to backend with Login Pipe');
      });

      this.loginClient.on('connect', () => {
        console.log('Login client is connected');
        resolve();
      });

      this.loginClient.on('data', (data) => {
        const message = data.toString();
        console.log('Received from Login backend:', message);
        if (message === 'Login Success') {
          ipcMain.emit('login-success');
        }
      });

      this.loginClient.on('end', () => {
        console.log('Disconnected from Login Pipe');
      });

      this.loginClient.on('error', (err) => {
        console.error('Login Pipe connection error:', err);
        reject(err);
      });
    }));
  }

  /**
   * Initializes the Encrypt client.
   * @returns {Promise} - Resolves when connected, rejects on error.
   */
  initEncryptClient() {
    const encryptPipeURL = this._getPipeURL('EncryptPipe');
    return new Promise((resolve, reject) => {
      this.encryptClient = net.createConnection(encryptPipeURL, () => {
        console.log('Connected to backend with Encrypt Pipe' + encryptPipeURL);
      });

      this.encryptClient.on('connect', () => {
        console.log('Encrypt client is connected');
        resolve();
      });

      this.encryptClient.on('end', () => {
        console.log('Disconnected from Encrypt Pipe');
      });

      this.encryptClient.on('error', (err) => {
        console.error('Encrypt Pipe connection error:', err);
        reject(err);
      });

      this.encryptClient.on('close', (hadError) => {
        console.log(`Encrypt Pipe connection closed${hadError ? ' due to error' : ''}`);
      });
    });
  }

  /**
   * Initializes the Decrypt client.
   * @param {string} pipeURL - The pipe URL to connect to.
   * @returns {Promise} - Resolves when connected, rejects on error.
   */
  initDecryptClient(pipeURL) {
    return this.connectWithRetry(() => new Promise((resolve, reject) => {
      this.decryptClient = net.createConnection(pipeURL, () => {
        console.log('Connected to backend with Decrypt Pipe');
      });

      this.decryptClient.on('connect', () => {
        console.log('Decrypt client is connected');
        resolve();
      });

      this.decryptClient.on('data', (data) => {
        const message = data.toString();
        console.log('Received from Decrypt backend:', message);
      });

      this.decryptClient.on('end', () => {
        console.log('Disconnected from Decrypt Pipe');
      });

      this.decryptClient.on('error', (err) => {
        console.error('Decrypt Pipe connection error:', err);
        reject(err);
      });
    }));
  }

  /**
   * Connects with retry logic.
   * @param {function} connectFn - A function that returns a promise to connect.
   * @param {number} retries - Number of times to retry.
   * @param {number} delay - Delay between retries in milliseconds.
   * @returns {Promise} - Resolves when connected, rejects on error.
   */
  async connectWithRetry(connectFn, retries = 10, delay = 2000) {
    for (let i = 0; i < retries; i++) {
      try {
        return await connectFn();
      } catch (error) {
        console.error(`Connection attempt ${i + 1} failed:`, error);
        if (i < retries - 1) {
          console.log(`Retrying in ${delay / 1000} seconds...`);
          await this.delay(delay);
        }
      }
    }
    throw new Error('All connection attempts failed.');
  }

  /**
   * Delays execution for a given amount of time.
   * @param {number} ms - The delay time in milliseconds.
   * @returns {Promise} - Resolves after the delay.
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Sends a message to a specified client.
   * @param {string} clientType - The type of client ('login', 'encrypt', 'decrypt').
   * @param {string|Buffer} message - The message to send.
   */
  onClientSendMsg(clientType, message) {
    let client;
    switch (clientType) {
      case 'login':
        client = this.loginClient;
        break;
      case 'encrypt':
        client = this.encryptClient;
        break;
      case 'decrypt':
        client = this.decryptClient;
        break;
      default:
        console.error('Unknown client type:', clientType);
        return;
    }

    if (client && !client.destroyed) {
      console.log(`Sending message to ${clientType} client:`, message);
      client.write(message);
      console.log('Message sent.');
    } else {
      console.error(`Cannot send message. ${clientType} client is not connected.`);
    }
  }

  /**
   * Close all client connections gracefully.
   */
  closeAllClients() {
    [this.loginClient, this.encryptClient, this.decryptClient].forEach((client, index) => {
      if (client) {
        client.end(() => {
          console.log(`Client ${index} disconnected gracefully.`);
        });
        client.destroy(); // Forcefully close if needed
      }
    });
  }
}

module.exports = ClientManager;
