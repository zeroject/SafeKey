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