let lastSelectedText = "";

// Listen for messages from content.js and popup.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Store selected text from webpages
  if (message.type === "TEXT_SELECTED") {
    lastSelectedText = message.text;
  }

  // Send selected text to popup
  if (message.type === "GET_TEXT") {
    sendResponse({ text: lastSelectedText });
  }

  // Required to allow async response
  return true;
});

// Create right-click context menu
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "analyzeText",
    title: "Analyze with Text Insight AI",
    contexts: ["selection"]
  });
});

// Open popup when context menu is clicked
chrome.contextMenus.onClicked.addListener(() => {
  chrome.action.openPopup();
});
