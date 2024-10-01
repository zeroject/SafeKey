document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
  
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
  
      const email = document.getElementById('password').value;
      const password = document.getElementById('secret').value;
  
      // Simple validation (expand as needed)
      if (email && password) {
        // TODO: Implement authentication logic
        alert(`Logging in with Email: ${email}`);
      } else {
        alert('Please enter both email and password.');
      }
    });
  });
  