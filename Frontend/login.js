document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
  
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

      window.api.onBackendMessage((data) => {
        // Handle the response from the backend
        console.log('Received message from backend:', data);
        // You can add logic to update the UI or handle errors based on the response
      });
  
      loginButton.removeAttribute('loading');
    });
  });
  