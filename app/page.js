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
    <div className="min-h-[85vh] bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4 py-8 transition-colors">
      <div className="w-full max-w-2xl animate-fade">
        {/* Main Card */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-2xl shadow-xl p-8 border border-indigo-100 dark:border-gray-700 transition-all hover:shadow-2xl">
          <h2 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 text-center">
            AI Text Detector
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Input */}
            <div>
              <label className="block text-sm font-semibold text-indigo-900 dark:text-indigo-300 mb-2">
                Enter text to analyze
              </label>

              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste or type the text you want to analyze..."
                rows={8}
                className="
              w-full rounded-xl border border-indigo-200 dark:border-gray-600
              px-4 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500
              bg-white dark:bg-gray-900
              resize-none
              focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500
              transition-all
            "
              />

              {text.length < MIN_LENGTH && (
                <p className="text-sm mt-2 text-rose-500 dark:text-rose-400 animate-fade">
                  {text.length}/{MIN_LENGTH} characters minimum
                </p>
              )}
            </div>

            {/* Analyze Button */}
            <button
              type="submit"
              disabled={loading || text.trim().length < MIN_LENGTH}
              className="
            w-full py-3 rounded-xl font-semibold text-white
            bg-gradient-to-r from-indigo-600 to-violet-600
            hover:from-indigo-700 hover:to-violet-700
            disabled:from-gray-400 disabled:to-gray-400
            disabled:cursor-not-allowed
            transition-all transform hover:scale-[1.02] active:scale-[0.98]
            shadow-lg hover:shadow-xl
          "
            >
              {loading ? "Analyzing..." : "Analyze Text"}
            </button>
          </form>
        </div>

        {/* AI Detection Result */}
        {result && (
          <div className="mt-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-2xl shadow-lg p-6 border border-indigo-100 dark:border-gray-700 animate-fade">
            {result.error ? (
              <p className="text-rose-600 dark:text-rose-400 font-medium">{result.error}</p>
            ) : (
              <div className="space-y-3">
                <p className="text-xs font-semibold text-indigo-500 dark:text-indigo-400 uppercase tracking-wider">
                  AI Detection Result
                </p>

                <p
                  className={`text-3xl font-bold transition-colors ${
                    result.label === "AI" ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"
                  }`}
                >
                  {result.label}
                </p>

                <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                  <p>
                    <b>Confidence:</b> {(result.confidence * 100).toFixed(2)}%
                  </p>
                  {result.chunks_analyzed && (
                    <p>
                      <b>Chunks analyzed:</b> {result.chunks_analyzed}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Grammar & Style Result */}
        {analysisResult && (
          <div className="mt-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-2xl shadow-lg p-6 space-y-6 border border-indigo-100 dark:border-gray-700 animate-fade">
            {analysisResult.error ? (
              <p className="text-rose-600 dark:text-rose-400 font-medium">
                {analysisResult.error}
              </p>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-indigo-900 dark:text-indigo-300">
                  Grammar & Style Analysis
                </h2>

                {/* Grammar Issues */}
                <div>
                  <h3 className="font-medium text-indigo-800 dark:text-indigo-400 mb-2">
                    Grammar Issues
                  </h3>
                  {analysisResult.grammar_errors?.length ? (
                    <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700 dark:text-gray-300">
                      {analysisResult.grammar_errors.map((e, i) => (
                        <li key={i} className="animate-fade" style={{ animationDelay: `${i * 0.1}s` }}>
                          <div className="font-medium">{e.message}</div>
                          {e.suggestions?.length > 0 && (
                            <div className="text-xs text-indigo-500 dark:text-indigo-400 mt-1">
                              Suggestions: {e.suggestions.join(", ")}
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-emerald-600 dark:text-emerald-400 text-sm">
                      ✓ No major grammar issues found.
                    </p>
                  )}
                </div>

                {/* Style Features */}
                {analysisResult.style_features && Object.keys(analysisResult.style_features).length > 0 && (
                  <div>
                    <h3 className="font-medium text-indigo-800 dark:text-indigo-400 mb-2">
                      Style Features
                    </h3>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      {Object.entries(analysisResult.style_features).map(([k, v], i) => (
                        <li key={k} className="animate-fade" style={{ animationDelay: `${i * 0.05}s` }}>
                          <b className="capitalize">{k.replace(/_/g, " ")}:</b> {String(v)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Explanation */}
                {analysisResult.explanations && analysisResult.explanations.length > 0 && (
                  <div>
                    <h3 className="font-medium text-indigo-800 dark:text-indigo-400 mb-2">
                      Explanation
                    </h3>
                    <ul className="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      {analysisResult.explanations.map((e, i) => (
                        <li key={i} className="animate-fade" style={{ animationDelay: `${i * 0.1}s` }}>
                          {e}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
