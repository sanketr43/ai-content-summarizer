// background.js (or service_worker.js in MV3)

// Minimal for MVP. Could be used for advanced tasks like subscription checks.
chrome.runtime.onInstalled.addListener(() => {
  console.log("AI Content Summarizer (Articles & Videos) installed.");
});
