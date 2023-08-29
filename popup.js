// Wait for the DOM content to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Get references to the necessary elements
  const extractButton = document.getElementById("extractButton");
  const summaryButton = document.getElementById("check");
  const outputDiv = document.getElementById("output");

  // Clear the output div's content
  outputDiv.textContent = "";

  // Add event listener for the extract button
  extractButton.addEventListener("click", async () => {
    // Get the active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // Extract text from the active tab
    const extractedText = await extractTextFromTab(tab.id);
    
    // Display the extracted text
    outputDiv.textContent = extractedText;

    // Enable the summary button
    summaryButton.disabled = false;
    
    // Hide the extract button and show a success message
    extractButton.style.display = "none";
    showSuccessMessage("Text Extracted!");
  });

  // Add event listener for the summary button
  summaryButton.addEventListener("click", async () => {
    // Get the extracted text
    const extractedText = outputDiv.textContent;

    // Generate a summary for the extracted text
    const summarizedText = await generateSummary(extractedText);

    // Display the summarized text
    outputDiv.textContent = summarizedText;
  });
});

// Function to extract text from a tab using content scripts
async function extractTextFromTab(tabId) {
  return new Promise(resolve => {
    chrome.scripting.executeScript(
      {
        target: { tabId: tabId },
        function: extractTextFunction
      },
      result => {
        const extractedText = result[0].result;
        resolve(extractedText);
      }
    );
  });
}

// Content script function to extract text from the DOM
const extractTextFunction = () => {
  return document.body.innerText;
};

// Utility function to show a success message
function showSuccessMessage(message) {
  const messageElement = document.getElementById('copyMessage');
  messageElement.textContent = message;
  messageElement.style.display = 'block';
  setTimeout(() => {
    messageElement.style.display = 'none';
  }, 2000); // Hide message after 2 seconds
}

// Get a reference to the "Copy Summary" button
const copySummaryButton = document.getElementById("copySummaryButton");

// Add event listener for the "Copy Summary" button
copySummaryButton.addEventListener("click", async () => {
  // Get the summarized text
  const summarizedText = $('p').text(); 

  try {
    // Copy the summarized text to the clipboard
    await navigator.clipboard.writeText(summarizedText);

    // Show a copy success message
    showSuccessMessage("Summary Copied!");
  } catch (error) {
    console.error("Copying failed:", error);
  }
});
