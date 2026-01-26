"use client";

import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const MIN_LENGTH = 40;

  const [analysisResult, setAnalysisResult] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (text.trim().length < MIN_LENGTH) {
      setResult({ error: `Please enter at least ${MIN_LENGTH} characters.` });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      setResult(data);
    } catch {
      setResult({
        error: "Failed to analyze text. Please check if backend is running.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!text.trim()) {
      setAnalysisResult({ error: "Text is required for analysis." });
      return;
    }

    setAnalysisLoading(true);
    setAnalysisResult(null);

    try {
      const response = await fetch(
        `http://localhost:8000/analyze`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Analysis failed");
      }

      setAnalysisResult(data);
    } catch (err) {
      setAnalysisResult({ error: err.message });
    } finally {
      setAnalysisLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 text-black">
      <div className="w-full max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Enter text to analyze
            </label>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste or type the text you want to analyze..."
              rows={8}
              className="w-full px-4 py-3 border rounded-lg resize-none"
            />

            {text.length < MIN_LENGTH && (
              <p className="text-sm mt-1 text-red-500">
                {text.length}/{MIN_LENGTH} characters minimum
              </p>
            )}
          </div>

          {/* AI Detection Button */}
          <button
            type="submit"
            disabled={loading || text.trim().length < MIN_LENGTH}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400  py-3 rounded-lg"
          >
            {loading ? "Analyzing..." : "Analyze Text"}
          </button>

          {/* Grammar + Style Button */}
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={analysisLoading || !text.trim()}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400  py-3 rounded-lg"
          >
            {analysisLoading
              ? "Analyzing Writing..."
              : "Analyze Grammar & Style"}
          </button>
        </form>

        {/* AI Detection Result */}
        {result && (
          <div className="mt-8 p-6 border rounded-lg bg-gray-50">
            {result.error ? (
              <p className="text-red-600">{result.error}</p>
            ) : (
              <div className="space-y-2">
                <p className="text-sm ">AI Detection Result</p>
                <p
                  className={`text-2xl font-bold ${
                    result.label === "AI"
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {result.label}
                </p>
                <p className="text-sm">
                  Confidence: {(result.confidence * 100).toFixed(2)}%
                </p>
                <p className="text-sm">
                  Chunks analyzed: {result.chunks_analyzed}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Grammar + Style Result */}
        {analysisResult && (
          <div className="mt-8 p-6 border rounded-lg bg-gray-50">
            {analysisResult.error ? (
              <p className="text-red-600">{analysisResult.error}</p>
            ) : (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">
                  Grammar & Style Analysis
                </h2>

                <div className="text-black">
                  <h3 className="font-medium">Grammar Issues</h3>
                  {analysisResult.grammar_errors?.length ? (
                    <ul className="list-disc pl-5 text-sm space-y-2">
                    {analysisResult.grammar_errors.map((e, i) => (
                      <li key={i}>
                        <div className="font-medium">{e.message}</div>

                        {e.suggestions?.length > 0 && (
                          <div className="text-xs ">
                            Suggestions: {e.suggestions.join(", ")}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>

                  ) : (
                    <p className="text-green-600 text-sm">
                      No major grammar issues found.
                    </p>
                  )}
                </div>

                <div>
                  <h3 className="font-medium">Style Features</h3>
                  <ul className="text-sm">
                    {Object.entries(
                      analysisResult.style_features || {}
                    ).map(([k, v]) => (
                      <li key={k}>
                        <b>{k}:</b> {String(v)}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium">Explanation</h3>
                  <ul className="list-disc pl-5 text-sm">
                    {analysisResult.explanations?.map((e, i) => (
                      <li key={i}>{e}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
