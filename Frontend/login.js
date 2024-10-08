
async function initialize() {
  try {
      await window.api.initClient(); // Wait for the client to initialize
      // Now you can safely update the UI
      window.api.onClientReady(() => {
          document.getElementById('loading').style.display = 'none';
          document.getElementById('content').style.display = 'block';
      });
  } catch (err) {
      console.error('Error initializing client:', err);
  }
}


document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    document.getElementById('loading').style.display = 'block';
    document.getElementById('content').style.display = 'none';

    initialize();
  
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
  
      const password = document.getElementById('password').value;
      const secret = document.getElementById('secret').value; // Not used in sendToBackend, consider if needed
      const loginButton = document.getElementById('login-button');
      loginButton.setAttribute('loading', 'true');
  
      console.log('Frontend Send');
      if (window.api && window.api.sendToBackend) {
        window.api.sendToBackend(password);
        console.log('Frontend Sent');
      } else {
        console.error('window.api.sendToBackend is not defined');
      }
  
      loginButton.removeAttribute('loading');
    });
  });
  