document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
  
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
  
      const password = document.getElementById('password').value;
      const secret = document.getElementById('secret').value;
      const loginButton = document.getElementById('login-button');
      loginButton.setAttribute('loading', 'true');
  
      // Simple validation (expand as needed)
      if (secret && password) {
        // TODO: Implement authentication logic
        setTimeout(() => {
          // Remove the loading state after the task is complete
          loginButton.removeAttribute('loading');
  
          // For demonstration, show a success alert
          alert(`Logged in with Email: ${email}`);
        }, 3000); // 3-second delay
      } else {
        alert('Please enter both email and password.');
      }
    });
  });
  