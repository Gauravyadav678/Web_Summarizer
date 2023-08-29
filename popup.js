document.addEventListener("DOMContentLoaded", function () {
  const extractButton = document.getElementById("extractButton");
  const summaryButton = document.getElementById("check");
  const outputDiv = document.getElementById("output");
  outputDiv.textContent = "";
  extractButton.addEventListener("click", async () => {
    
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    const extractedText = await extractTextFromTab(tab.id);
    outputDiv.textContent = extractedText;
   
    

    summaryButton.disabled = false;
    
    // Show extract success message
    extractButton.style.display = "none";
    showSuccessMessage("Text Extracted!");
    
  });

 

  // Add event listener for the summary button
  summaryButton.addEventListener("click", async () => {
    const extractedText = outputDiv.textContent;
    const summarizedText = await generateSummary(extractedText);
    outputDiv.textContent = summarizedText;
   
  });
});

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

const extractTextFunction = () => {
  return document.body.innerText;
};




// Utility function to show success message
function showSuccessMessage(message) {
  const messageElement = document.getElementById('copyMessage');
  messageElement.textContent = message;
  messageElement.style.display = 'block';
  setTimeout(() => {
    messageElement.style.display = 'none';
  }, 2000); // Hide message after 2 seconds
}


const copySummaryButton = document.getElementById("copySummaryButton");
copySummaryButton.addEventListener("click", async () => {
  const summarizedText = $('p').text(); 
  try {
    await navigator.clipboard.writeText(summarizedText);
    // Show copy success message
    showSuccessMessage("Summary Copied!");
  } catch (error) {
    console.error("Copying failed:", error);
  }
});









