// mainApp.js
// Add any JavaScript needed for your main application page
console.log('Main application loaded.');

window.api.AskForData((event, data) => {
    // Example response from the backend
    const backendData = data;
    
    // Simulate processing time
    setTimeout(() => {
      // Hide skeleton loader
      document.getElementById("loading").style.display = "none";
      
      // Display the entries list
      const entryList = document.getElementById("entry-list");
      entryList.style.display = "block";

      const entryContainer = document.getElementById("entry-container");
      const entries = backendData.split(";");

      // Filter out any empty strings and display the rest
      entries.forEach(entry => {
        if (entry.trim()) {
          const listItem = document.createElement("li");
          listItem.textContent = entry;
          entryContainer.appendChild(listItem);
        }
      });
    }, 2000); // Mock delay for the backend response
  });

// Open the dialog when the "Create Password" button is clicked
const createPasswordButton = document.getElementById("create-password-button");
const createPasswordDialog = document.getElementById("create-password-dialog");
createPasswordButton.addEventListener('click', () => {
  createPasswordDialog.open = true;
});

// Close the dialog when cancel is clicked
const cancelDialogButton = document.getElementById("cancel-dialog");
cancelDialogButton.addEventListener('click', () => {
  createPasswordDialog.open = false;
});

// Auto-generate password logic
const autoGeneratePasswordButton = document.getElementById("auto-generate-password");
const passwordInput = document.getElementById("entry-password");

autoGeneratePasswordButton.addEventListener('click', () => {
  const generatedPassword = Math.random().toString(36).slice(-10); // Generate a simple random password
  passwordInput.value = generatedPassword;
});

// Submit button logic (you can handle the form submission here)
const submitEntryButton = document.getElementById("submit-entry");
submitEntryButton.addEventListener('click', () => {
  const entryName = document.getElementById("entry-name").value;
  const entryUsername = document.getElementById("entry-username").value;
  const entryPassword = document.getElementById("entry-password").value;

  if (entryName && entryUsername && entryPassword) {
    // You can send this data to the backend or process it as needed
    console.log({ entryName, entryUsername, entryPassword });
    window.api.sendToBackend('encrypt', `${entryName};${entryUsername};${entryPassword}`);

    // Close the dialog after submission
    createPasswordDialog.open = false;
  } else {
    alert("All fields are required.");
  }
});