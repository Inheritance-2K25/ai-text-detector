"use client";
import React, { useState } from "react";

export default function Page() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(0);

  const MIN_LENGTH = 80;

  const runCheck = () => {
    setLoading(true);

    // fake result (replace with API later)
    setTimeout(() => {
      setScore(Math.floor(Math.random() * 60) + 20);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-[85vh] bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4 py-8 transition-colors">
      <div className="w-full max-w-3xl animate-fade">
        {/* Card */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-2xl shadow-xl p-8 border border-indigo-100 dark:border-gray-700 transition-all hover:shadow-2xl">
          <h2 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 text-center">
            Plagiarism Checker
          </h2>

          <p className="text-gray-500 dark:text-gray-400 text-center mt-2">
            Enter at least {MIN_LENGTH} characters to scan for plagiarism.
          </p>

          {/* Textarea */}
          <div className="mt-6">
            <label className="block text-sm font-semibold text-indigo-900 dark:text-indigo-300 mb-2">
              Enter text to check
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={10}
              placeholder="Paste your text here..."
              className="
                w-full rounded-xl border border-indigo-200 dark:border-gray-600
                px-4 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500
                bg-white dark:bg-gray-900
                resize-none
                focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500
                transition-all
              "
            />

            <p
              className={`text-sm mt-2 animate-fade ${
                text.length < MIN_LENGTH ? "text-rose-500 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {text.length}/{MIN_LENGTH} characters
            </p>
          </div>

          {/* Button */}
          <button
            onClick={runCheck}
            disabled={loading || text.length < MIN_LENGTH}
            className="
              mt-6 w-full py-3 rounded-xl font-semibold text-white
              bg-gradient-to-r from-indigo-600 to-purple-600
              hover:from-indigo-700 hover:to-purple-700
              disabled:from-gray-400 disabled:to-gray-400
              disabled:cursor-not-allowed
              transition-all transform hover:scale-[1.02] active:scale-[0.98]
              shadow-lg hover:shadow-xl
            "
          >
            {loading ? "Scanning..." : "Scan for Plagiarism"}
          </button>
        </div>

        {/* Result */}
        {score > 0 && (
          <div className="mt-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-2xl shadow-lg p-6 border border-indigo-100 dark:border-gray-700 animate-fade">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Results</h3>

            <div
              className={`mt-4 text-5xl font-bold transition-colors ${
                score > 40 ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {score}%
            </div>

            <p className="text-gray-500 dark:text-gray-400 mt-1">Plagiarism Detected</p>

            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              Possible sources will appear here.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
