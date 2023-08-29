// Check if the runtime environment is "browser" (Firefox) or "chrome" (Chrome)
const runtime = typeof browser !== "undefined" ? browser : chrome;

// Listen for messages from the extension popup or content scripts
runtime.runtime.onMessage.addListener((message, sender, sendResponse) => {
  
  // Check if the message action is to extract text
  if (message.action === "extractText") {
    // Query the active tab in the current window
    runtime.tabs.query({ active: true, currentWindow: true }, tabs => {
      // Send a message to the active tab's content script to initiate text extraction
      runtime.tabs.sendMessage(tabs[0].id, { action: "extractText" }, response => {
        // Send the response from the content script back to the popup
        sendResponse(response);
      });
    });

    // Indicate that the response will be sent asynchronously
    return true;
  }
});
