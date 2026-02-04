"use client";

import { useState } from "react";

export default function GrammarCheckerPage() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const MIN_LENGTH = 40;

  const handleAnalyze = async () => {
    if (!text.trim() || text.trim().length < MIN_LENGTH) {
      setResult({ error: `Please enter at least ${MIN_LENGTH} characters.` });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Analysis failed");
      }

      setResult(data);
    } catch (err) {
      setResult({ error: err.message || "Failed to analyze text. Please check if backend is running." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4 py-8 transition-colors">
      <div className="w-full max-w-3xl animate-fade">
        {/* Main Card */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-2xl shadow-xl p-8 border border-indigo-100 dark:border-gray-700 transition-all hover:shadow-2xl">
          <h2 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 text-center mb-2">
            Grammar Checker
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-center mb-6">
            Analyze your text for grammar errors and style improvements
          </p>

          {/* Textarea */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-indigo-900 dark:text-indigo-300 mb-2">
              Enter text to check
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste or type the text you want to check..."
              rows={10}
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

          {/* Button */}
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={loading || text.trim().length < MIN_LENGTH}
            className="
              w-full py-3 rounded-xl font-semibold text-white
              bg-gradient-to-r from-purple-600 to-indigo-600
              hover:from-purple-700 hover:to-indigo-700
              disabled:from-gray-400 disabled:to-gray-400
              disabled:cursor-not-allowed
              transition-all transform hover:scale-[1.02] active:scale-[0.98]
              shadow-lg hover:shadow-xl
            "
          >
            {loading ? "Analyzing Writing..." : "Analyze Grammar & Style"}
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className="mt-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-2xl shadow-lg p-6 border border-indigo-100 dark:border-gray-700 space-y-6 animate-fade">
            {result.error ? (
              <p className="text-rose-600 dark:text-rose-400 font-medium">
                {result.error}
              </p>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-indigo-900 dark:text-indigo-300">
                  Grammar & Style Analysis
                </h2>

                {/* Grammar Issues */}
                <div>
                  <h3 className="font-medium text-indigo-800 dark:text-indigo-400 mb-3">
                    Grammar Issues
                  </h3>
                  {result.grammar_errors?.length ? (
                    <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700 dark:text-gray-300">
                      {result.grammar_errors.map((e, i) => (
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
                {result.style_features && Object.keys(result.style_features).length > 0 && (
                  <div>
                    <h3 className="font-medium text-indigo-800 dark:text-indigo-400 mb-3">
                      Style Features
                    </h3>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      {Object.entries(result.style_features).map(([k, v], i) => (
                        <li key={k} className="animate-fade" style={{ animationDelay: `${i * 0.05}s` }}>
                          <b className="capitalize">{k.replace(/_/g, " ")}:</b> {String(v)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Explanation */}
                {result.explanations && result.explanations.length > 0 && (
                  <div>
                    <h3 className="font-medium text-indigo-800 dark:text-indigo-400 mb-3">
                      Explanation
                    </h3>
                    <ul className="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      {result.explanations.map((e, i) => (
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

"use client";

import { useState } from "react";

export default function GrammarCheckerPage() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const MIN_LENGTH = 40;

  const handleAnalyze = async () => {
    if (!text.trim() || text.trim().length < MIN_LENGTH) {
      setResult({ error: `Please enter at least ${MIN_LENGTH} characters.` });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Analysis failed");
      }

      setResult(data);
    } catch (err) {
      setResult({ error: err.message || "Failed to analyze text. Please check if backend is running." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4 py-8 transition-colors">
      <div className="w-full max-w-3xl animate-fade">
        {/* Main Card */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-2xl shadow-xl p-8 border border-indigo-100 dark:border-gray-700 transition-all hover:shadow-2xl">
          <h2 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 text-center mb-2">
            Grammar Checker
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-center mb-6">
            Analyze your text for grammar errors and style improvements
          </p>

          {/* Textarea */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-indigo-900 dark:text-indigo-300 mb-2">
              Enter text to check
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste or type the text you want to check..."
              rows={10}
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

          {/* Button */}
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={loading || text.trim().length < MIN_LENGTH}
            className="
              w-full py-3 rounded-xl font-semibold text-white
              bg-gradient-to-r from-purple-600 to-indigo-600
              hover:from-purple-700 hover:to-indigo-700
              disabled:from-gray-400 disabled:to-gray-400
              disabled:cursor-not-allowed
              transition-all transform hover:scale-[1.02] active:scale-[0.98]
              shadow-lg hover:shadow-xl
            "
          >
            {loading ? "Analyzing Writing..." : "Analyze Grammar & Style"}
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className="mt-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-2xl shadow-lg p-6 border border-indigo-100 dark:border-gray-700 space-y-6 animate-fade">
            {result.error ? (
              <p className="text-rose-600 dark:text-rose-400 font-medium">
                {result.error}
              </p>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-indigo-900 dark:text-indigo-300">
                  Grammar & Style Analysis
                </h2>

                {/* Grammar Issues */}
                <div>
                  <h3 className="font-medium text-indigo-800 dark:text-indigo-400 mb-3">
                    Grammar Issues
                  </h3>
                  {result.grammar_errors?.length ? (
                    <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700 dark:text-gray-300">
                      {result.grammar_errors.map((e, i) => (
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
                {result.style_features && Object.keys(result.style_features).length > 0 && (
                  <div>
                    <h3 className="font-medium text-indigo-800 dark:text-indigo-400 mb-3">
                      Style Features
                    </h3>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      {Object.entries(result.style_features).map(([k, v], i) => (
                        <li key={k} className="animate-fade" style={{ animationDelay: `${i * 0.05}s` }}>
                          <b className="capitalize">{k.replace(/_/g, " ")}:</b> {String(v)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Explanation */}
                {result.explanations && result.explanations.length > 0 && (
                  <div>
                    <h3 className="font-medium text-indigo-800 dark:text-indigo-400 mb-3">
                      Explanation
                    </h3>
                    <ul className="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      {result.explanations.map((e, i) => (
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
