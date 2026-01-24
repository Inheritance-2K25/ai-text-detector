"use client";

import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: "Failed to analyze text. Please check if backend is running." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="text" className="block text-sm font-medium mb-2">
              Enter text to analyze
            </label>
            <textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste or type the text you want to analyze..."
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 resize-none"
              rows={8}
            />
          </div>
          <button
            type="submit"
            disabled={loading || !text.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            {loading ? "Analyzing..." : "Analyze Text"}
          </button>
        </form>

        {result && (
          <div className="mt-8 p-6 border border-gray-200 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-gray-900">
            {result.error ? (
              <p className="text-red-600 dark:text-red-400">{result.error}</p>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">Result:</p>
                <p className={`text-2xl font-bold ${result.label === "AI" ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}>
                  {result.label}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Confidence: {(result.confidence * 100).toFixed(2)}%
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
