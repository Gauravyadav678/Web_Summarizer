
const runtime = typeof browser !== "undefined" ? browser : chrome;

runtime.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "extractText") {
    runtime.tabs.query({ active: true, currentWindow: true }, tabs => {
      runtime.tabs.sendMessage(tabs[0].id, { action: "extractText" }, response => {
        sendResponse(response);
      });
    });

    return true;
  }
});
