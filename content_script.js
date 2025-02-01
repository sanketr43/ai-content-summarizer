// content_script.js

// -------------- CONFIG --------------
const HF_API_TOKEN = "YOUR_HUGGING_FACE_TOKEN_HERE"; 
const MODEL_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn";

// You can tweak these summarization parameters
const SUMMARIZATION_PARAMS = {
  max_length: 120,
  min_length: 30,
  do_sample: false
};

// Button ID to avoid duplicates
const BUTTON_ID = "ai-content-summarizer-btn";

// -------------- CORE --------------

// Insert Summarize Button on any page
function insertSummarizeButton() {
  // Avoid duplicating button
  if (document.getElementById(BUTTON_ID)) return;

  const btn = document.createElement("button");
  btn.id = BUTTON_ID;
  btn.innerText = "Summarize";
  btn.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 9999;
    background-color: #6200EE;
    color: #fff;
    border: none;
    border-radius: 4px;
    padding: 10px;
    font-size: 14px;
    cursor: pointer;
  `;
  
  btn.addEventListener("click", handleSummarizeClick);

  document.body.appendChild(btn);
}

async function handleSummarizeClick() {
  try {
    // 1. Decide if it's a YouTube video or an article
    const url = window.location.href;
    let textToSummarize = "";

    if (url.includes("youtube.com/watch")) {
      textToSummarize = getYouTubeTranscriptText();
      if (!textToSummarize) {
        alert("No transcript found. Please open the transcript panel on YouTube, then try again.");
        return;
      }
    } else {
      // Assume it's an article
      textToSummarize = getArticleText();
      if (!textToSummarize || textToSummarize.trim().length < 50) {
        alert("Couldn't find enough text on this page to summarize.");
        return;
      }
    }

    // 2. Summarize
    const summary = await summarizeText(textToSummarize);
    // 3. Display summary
    displaySummary(summary);

  } catch (err) {
    console.error("Summarization Error:", err);
    alert("Error: " + err.message);
  }
}

// Attempt to parse entire article text from the page
function getArticleText() {
  // Basic approach: get all text in <body>, or you can use a "readability" library.
  // For MVP, let's keep it simple:
  return document.body.innerText;
}

// Attempt to grab transcript from YouTube page
// Note: This approach is fragile if YouTube changes their DOM.
function getYouTubeTranscriptText() {
  // If the user has opened the transcript, typically there's a .ytd-transcript-segment-list-renderer
  // that holds lines of transcript
  const transcriptSegments = document.querySelectorAll("ytd-transcript-segment-renderer");
  
  if (!transcriptSegments || transcriptSegments.length === 0) {
    return null; 
  }

  let transcriptText = "";
  transcriptSegments.forEach(segment => {
    const textElement = segment.querySelector("#segment-text");
    if (textElement && textElement.innerText) {
      transcriptText += textElement.innerText.trim() + " ";
    }
  });

  return transcriptText;
}

// Call Hugging Face Summarization API
async function summarizeText(inputText) {
  const payload = {
    inputs: inputText,
    parameters: SUMMARIZATION_PARAMS
  };

  const response = await fetch(MODEL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${HF_API_TOKEN}`
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Hugging Face API error: ${response.status} ${await response.text()}`);
  }

  const data = await response.json();
  if (data && Array.isArray(data) && data[0]?.summary_text) {
    return data[0].summary_text;
  } else {
    throw new Error("No summary returned from the model.");
  }
}

// Display the summary in a basic overlay or alert. Here: alert for MVP
function displaySummary(summary) {
  alert("Summary:\n\n" + summary);
}

// Observe page changes and insert the button
// This helps if the user navigates within a single-page app or YouTube
let observer = null;
function startObserver() {
  if (observer) return;

  observer = new MutationObserver(() => {
    insertSummarizeButton();
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

window.addEventListener("load", () => {
  // Wait a bit for the page to render
  setTimeout(() => {
    startObserver();
    // Insert button once on load
    insertSummarizeButton();
  }, 2000);
});
