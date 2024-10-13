
async function initialize() {
  try {
      // Now you can safely update the UI
      window.api.ConnectedToBackend((event) => {
        console.log('Has been summoned');
          document.getElementById('loading').style.display = 'none';
          document.getElementById('content').style.display = 'block';
      });
  } catch (err) {
      console.error('Error initializing client:', err);
  }
}


document.addEventListener('DOMContentLoaded', () => {
    window.api.initClient();
    const loginForm = document.getElementById('login-form');
    document.getElementById('loading').style.display = 'block';
    document.getElementById('content').style.display = 'none';

    const registerBtn = document.getElementById('register');
    const registerDialog = document.getElementById('register-dialog');
    const confirm = document.getElementById('confirm');
    const sc = document.getElementById('secret-input');

    registerBtn.addEventListener('click', () => {
      registerDialog.open = true;
      sc.style.display = 'none';
      window.api.register();
      window.api.registerDone((event, secret) => {
        document.getElementById('register-loading').style.display = 'none';
        sc.style.display = 'block';
        sc.value = secret;
        document.getElementById('secret').value = secret;
      });
    });

    confirm.addEventListener('click', () => {
      registerDialog.open = false;
    });

    initialize();
  
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
  
      const password = document.getElementById('password').value;
      const secret = document.getElementById('secret').value;
      const loginButton = document.getElementById('login-button');
      loginButton.setAttribute('loading', 'true');
  
      console.log('Frontend Send');
      if (window.api && window.api.sendToBackend) {
        window.api.sendToBackend('login', password + ';' + secret);
        console.log('Frontend Sent');
      } else {
        console.error('window.api.sendToBackend is not defined');
      }
    });
  });
  