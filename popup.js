// wait for the document to laod
document.addEventListener("DOMContentLoaded", function () {
  const extractButton = document.getElementById("extractButton");
  const summaryButton = document.getElementById("check");
  const outputDiv = document.getElementById("output");
  const blur = document.getElementById("blur");
    const popup1 = document.getElementById("popup");
    const extractButton1 = document.querySelector("#blur button");
    const closeButton = popup1.querySelector("button");
    const pc=document.getElementById("pc");
    outputDiv.textContent = "";
    extractButton.addEventListener("click", async () => {
    
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const extractedText = await extractTextFromTab(tab.id);
    pc.textContent=extractedText;
    extractedTextContent.textContent=extractedText;
    showSuccessMessage("Text Extracted!");
    extractedTextContent.style.display = "block";
 
    summaryButton.disabled = false;
    outputDiv.textContent ="none";

    
  });

   extractButton1.addEventListener("click", function () {
    // Toggle the visibility of blur and popup1
    blur.classList.toggle("active");
    popup1.classList.toggle("active");
   });

  closeButton.addEventListener("click", function () {
    // Toggle the visibility of blur and popup1
    blur.classList.toggle("active");
    popup1.classList.toggle("active");
  });


  // Add event listener for the summary button
  summaryButton.addEventListener("click", async () => {
    const extractedText = extractedTextContent.textContent;
    const summarizedText = extractedText;
    outputDiv.textContent = summarizedText;
 
    extractedTextContent.style.display = "none";

    // Show the output div
    outputDiv.style.display = "block";
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
  const summarizedText = $('#pc').text(); 
  try {
    await navigator.clipboard.writeText(summarizedText);
    // Show copy success message
    showSuccessMessage("Copy To Clipboard!");
  } catch (error) {
    console.error("Copying failed:", error);
  }
});









