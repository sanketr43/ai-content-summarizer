# AI Content Summarizer (Articles & Videos)

A **Chrome Extension** that summarizes:
- **Articles** on any webpage (by extracting body text).
- **YouTube videos** (by parsing opened transcripts).

Powered by **Hugging Face** free summarization model ([facebook/bart-large-cnn](https://huggingface.co/facebook/bart-large-cnn)).

## Features
- Inserts a "Summarize" button in the bottom-right corner of the browser.
- For articles: Summarizes the main text on the page.
- For YouTube: Summarizes the transcript text (if the transcript is opened).
- Displays the summary in a simple `alert()`.

## Setup & Installation

1. **Clone or Download** this repository.
2. **Get a Hugging Face API Token**:
   - Sign up on [HuggingFace.co](https://huggingface.co/) if you haven't already.
   - Generate a personal access token in [Settings > Access Tokens](https://huggingface.co/settings/tokens).
3. **Open `content_script.js`** and replace `"YOUR_HUGGING_FACE_TOKEN_HERE"` with your token.
4. **Load the extension in Chrome**:
   - Go to `chrome://extensions`.
   - Enable **Developer Mode**.
   - Click **"Load unpacked"**.
   - Select the **`ai-content-summarizer`** folder.
5. Navigate to **any article page** or **YouTube**:
   - On an article site, click **Summarize** to get a quick summary.
   - On YouTube, open the transcript (3 dots -> Show transcript), then click **Summarize**.

## Caveats
- **Storing the token** in the code is **not secure**. Consider routing API calls through a server in production.
- **YouTube DOM** can change. This parser may break if YouTube updates their structure.
- For **better article extraction**, you might integrate a library like `readability.js` or Mercury Parser for more accurate text extraction.

## Future Improvements
- Add usage limits or subscription model.
- Switch from `alert()` to a custom pop-up UI or side panel.
- Handle transcripts automatically for YouTube (using official API).
- Provide multiple summary lengths or bullet-point vs. paragraph style.

## License
MIT License. Free for your personal or commercial use.
