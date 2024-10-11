// mainApp.js
// Add any JavaScript needed for your main application page
console.log("Main application loaded.");

window.api.AskForData((event, data) => {
  // Example response from the backend
  const backendData = data;
  console.log("Received from backend:", backendData);

  document.getElementById("loading").style.display = "none";

  // Display the entries list
  const entryList = document.getElementById("entry-list");
  entryList.style.display = "block";

  const entryContainer = document.getElementById("entry-list");
  entryContainer.innerHTML = ''; // This removes all existing child elements
  const entries = backendData.split(":");

  // Filter out any empty strings and display the rest
  entries.forEach((entry) => {
    if (entry.trim()) {
      const vars = entry.split(";");
      const name = vars[0].trim();
      const username = vars[1].trim();
      const password = vars[2].trim();

      // Create the wa-card element
      const card = document.createElement("wa-card");
      card.classList.add("entry-card");
      card.setAttribute("with-header", ""); // Add the 'with-header' attribute
      // Create the header slot
      const header = document.createElement("div");
      header.setAttribute("slot", "header");
      header.classList.add("entry-header");
      header.textContent = name; // Set the name as header text
      // Create the username and password elements
      const usernameElement = document.createElement("p");
      usernameElement.classList.add("entry-username");
      usernameElement.textContent = "Username: "+ username; // Set the username text

      const passwordElement = document.createElement("input");
      passwordElement.setAttribute("type", "password");
      passwordElement.setAttribute("id", "password-field");
      passwordElement.setAttribute("readonly", "true");
      passwordElement.classList.add("entry-password");
      passwordElement.value = password; // Set the password text

      const copyPasswordButton = document.createElement("wa-copy-button");
      copyPasswordButton.classList.add("custom-styles");
      copyPasswordButton.setAttribute("value", password);


      // Append the header and content to the card
      card.appendChild(header);
      card.appendChild(usernameElement);
      card.appendChild(passwordElement);
      card.appendChild(copyPasswordButton);

      // Append the card to the entry container
      entryContainer.appendChild(card);
    }
  });
});

// Open the dialog when the "Create Password" button is clicked
const createPasswordButton = document.getElementById("create-password-button");
const createPasswordDialog = document.getElementById("create-password-dialog");
createPasswordButton.addEventListener("click", () => {
  createPasswordDialog.open = true;
});

// Close the dialog when cancel is clicked
const cancelDialogButton = document.getElementById("cancel-dialog");
cancelDialogButton.addEventListener("click", () => {
  createPasswordDialog.open = false;
});

// Auto-generate password logic
const autoGeneratePasswordButton = document.getElementById(
  "auto-generate-password"
);
const passwordInput = document.getElementById("entry-password");

autoGeneratePasswordButton.addEventListener("click", () => {
  const generatedPassword = generateStrongPassword(); // Generate a simple random password
  passwordInput.value = generatedPassword;
});

function generateStrongPassword(length = 18) {
  const upperCaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowerCaseLetters = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+[]{}|,./<>?`~-=\\'; // Excluding ";" and ":"

  const allCharacters = upperCaseLetters + lowerCaseLetters + numbers + symbols;
  
  let password = '';
  for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * allCharacters.length);
      password += allCharacters[randomIndex];
  }

  return password;
}

// Submit button logic (you can handle the form submission here)
const submitEntryButton = document.getElementById("submit-entry");
submitEntryButton.addEventListener("click", () => {
  const entryName = document.getElementById("entry-name").value;
  const entryUsername = document.getElementById("entry-username").value;
  const entryPassword = document.getElementById("entry-password").value;

  if (entryName && entryUsername && entryPassword) {
    // You can send this data to the backend or process it as needed
    console.log({ entryName, entryUsername, entryPassword });
    window.api.sendNewEntry(
      `${entryName};${entryUsername};${entryPassword}`
    );

    // Close the dialog after submission
    createPasswordDialog.open = false;
  } else {
    alert("All fields are required.");
  }
});
