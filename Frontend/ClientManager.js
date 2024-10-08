const os = require('os');
const net = require('net');
const { ipcMain } = require('electron');

class ClientManager {

  constructor() {
    this.client = null; // Properly declare client as a class property
    this.readyPromise = null; // Initialize readyPromise
  }

  // Initialize the client and set up the 'ready' event listener
  initClient() {
    const pipeName = os.platform() === 'win32' ? '\\\\.\\pipe\\LoginPipe' : '/tmp/LoginPipe.sock';
    this.readyPromise = new Promise((resolve, reject) => {
        this.client = net.createConnection(pipeName, () => {
            console.log('Connected to backend with named pipes');
        });

        this.client.on('ready', () => {
            console.log('Client is ready');
            // Call the ready callback and resolve the promise
            this.onClientReady();
            resolve(); // Resolve the promise
        });

        this.client.on('data', (data) => {
            console.log('Received from backend:', data.toString());
            if (data.toString() === 'Login Success'){
              ipcMain.emit('login-success');
            }
            // Forward data to renderer process
        });

        this.client.on('end', () => {
            console.log('Disconnected from backend');
        });

        this.client.on('error', (err) => {
            console.error('Pipe connection error:', err);
            reject(err); // Reject the promise on error
        });
    });

    return this.readyPromise; // Return the promise
  }

  // Placeholder for the function to handle when the client is ready
  onClientReady() {
    console.log('Client is ready - perform actions here.');
  }

  onClientSendMsg(message) {
    console.log('Sending msg');
    this.client.write(message);
    console.log('Msg is sent');
  }
}
module.exports = ClientManager;
