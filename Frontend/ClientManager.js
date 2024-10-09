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
    const encryptPipeURL = this._getPipeURL('EncryptPipe');
    const decryptPipeURL = this._getPipeURL('DecryptPipe');

    this.loginReady = this.initLoginClient(loginPipeURL);
    this.encryptReady = this.initEncryptClient(encryptPipeURL);
    this.decryptReady = this.initDecryptClient(decryptPipeURL);

    return Promise.all([this.loginReady, this.encryptReady, this.decryptReady])
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
    return new Promise((resolve, reject) => {
      this.loginClient = net.createConnection(pipeURL, () => {
        console.log('Connected to backend with Login Pipe');
      });

      this.loginClient.on('connect', () => {
        console.log('Login client is connected');
        this.onClientReady('login');
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
    });
  }

  /**
   * Initializes the Encrypt client.
   * @param {string} pipeURL - The pipe URL to connect to.
   * @returns {Promise} - Resolves when connected, rejects on error.
   */
  initEncryptClient(pipeURL) {
    return new Promise((resolve, reject) => {
      this.encryptClient = net.createConnection(pipeURL, () => {
        console.log('Connected to backend with Encrypt Pipe');
      });

      this.encryptClient.on('connect', () => {
        console.log('Encrypt client is connected');
        resolve();
      });

      this.encryptClient.on('data', (data) => {
        const message = data.toString();
        console.log('Received from Encrypt backend:', message);
      });

      this.encryptClient.on('end', () => {
        console.log('Disconnected from Encrypt Pipe');
      });

      this.encryptClient.on('error', (err) => {
        console.error('Encrypt Pipe connection error:', err);
        reject(err);
      });
    });
  }

  /**
   * Initializes the Decrypt client.
   * @param {string} pipeURL - The pipe URL to connect to.
   * @returns {Promise} - Resolves when connected, rejects on error.
   */
  initDecryptClient(pipeURL) {
    return new Promise((resolve, reject) => {
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
    });
  }

  /**
   * Handler called when a client is ready.
   * @param {string} clientType - The type of client ('login', 'encrypt', 'decrypt').
   */
  onClientReady(clientType) {
    console.log(`${clientType.charAt(0).toUpperCase() + clientType.slice(1)} client is ready - perform actions here.`);
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
