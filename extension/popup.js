const MIN_LENGTH = 40;

// Elements
const textInput = document.getElementById("textInput");
const charCount = document.getElementById("charCount");
const resultDiv = document.getElementById("result");
const analysisDiv = document.getElementById("analysisResult");
const aiDetectBtn = document.getElementById("aiDetectBtn");
const grammarBtn = document.getElementById("grammarBtn");

// Character counter
textInput.addEventListener("input", () => {
  if (textInput.value.length < MIN_LENGTH) {
    charCount.textContent = `${textInput.value.length}/${MIN_LENGTH} characters minimum`;
  } else {
    charCount.textContent = "";
  }
});

// Autofill selected text from webpage
chrome.runtime.sendMessage({ type: "GET_TEXT" }, (res) => {
  if (res?.text) {
    textInput.value = res.text;
  }
});

// AI Detection
aiDetectBtn.onclick = async () => {
  const text = textInput.value.trim();
  resultDiv.innerHTML = "";
  analysisDiv.innerHTML = "";

  if (text.length < MIN_LENGTH) {
    resultDiv.innerHTML = `
      <div class="result-box">
        <p class="error">Please enter at least ${MIN_LENGTH} characters.</p>
      </div>`;
    return;
  }

  aiDetectBtn.disabled = true;
  aiDetectBtn.textContent = "Analyzing...";

  try {
    const response = await fetch("http://localhost:8000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });

    const data = await response.json();

    resultDiv.innerHTML = `
      <div class="result-box">
        <h3>AI Detection Result</h3>
        <p><b>${data.label}</b></p>
        <p>Confidence: ${(data.confidence * 100).toFixed(2)}%</p>
        <p>Chunks analyzed: ${data.chunks_analyzed}</p>
      </div>
    `;
  } catch {
    resultDiv.innerHTML = `
      <div class="result-box">
        <p class="error">Failed to analyze text. Is the backend running?</p>
      </div>`;
  } finally {
    aiDetectBtn.disabled = false;
    aiDetectBtn.textContent = "Analyze Text";
  }
};

// Grammar & Style Analysis
grammarBtn.onclick = async () => {
  const text = textInput.value.trim();
  analysisDiv.innerHTML = "";

  if (!text) {
    analysisDiv.innerHTML = `
      <div class="result-box">
        <p class="error">Text is required for analysis.</p>
      </div>`;
    return;
  }

  grammarBtn.disabled = true;
  grammarBtn.textContent = "Analyzing Writing...";

  try {
    const response = await fetch("http://127.0.0.1:8000", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || "Analysis failed");

    let grammarHTML = "<h3>Grammar Issues</h3>";

    if (data.grammar_errors?.length) {
      grammarHTML += "<ul>";
      data.grammar_errors.forEach(e => {
        grammarHTML += `
          <li>
            <b>${e.message}</b><br/>
            <small>${e.suggestions?.join(", ") || ""}</small>
          </li>`;
      });
      grammarHTML += "</ul>";
    } else {
      grammarHTML += "<p>No major grammar issues found.</p>";
    }

    analysisDiv.innerHTML = `
      <div class="result-box">
        <h2>Grammar & Style Analysis</h2>
        ${grammarHTML}
      </div>
    `;
  } catch (err) {
    analysisDiv.innerHTML = `
      <div class="result-box">
        <p class="error">${err.message}</p>
      </div>`;
  } finally {
    grammarBtn.disabled = false;
    grammarBtn.textContent = "Analyze Grammar & Style";
  }
};
