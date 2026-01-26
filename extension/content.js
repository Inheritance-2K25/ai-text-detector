// content.js
document.addEventListener("mouseup", () => {
  const text = window.getSelection().toString();
  if (text.length > 0) {
    chrome.runtime.sendMessage({
      type: "TEXT_SELECTED",
      text
    });
  }
});
