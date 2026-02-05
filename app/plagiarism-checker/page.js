"use client";

import React, { useState } from "react";

export default function Page() {

  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const MIN_LENGTH = 100;

  const runCheck = async () => {

    try {

      setLoading(true);
      setResult(null);

      console.log("Sending request...");

      const response = await fetch("http://127.0.0.1:8000/plagiarism", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      console.log("Response:", response);

      const data = await response.json();

      console.log("DATA:", data);

      setResult(data);

    } catch (error) {

      console.error("API Error:", error);

    } finally {

      setLoading(false);

    }
  };

  return (

    <div className="min-h-[85vh] bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4 py-8">

      <div className="w-full max-w-3xl">

        {/* Card */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-2xl shadow-xl p-8">

          <h2 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 text-center">
            Plagiarism Checker
          </h2>

          <p className="text-gray-500 text-center mt-2">
            Enter at least {MIN_LENGTH} characters to scan for plagiarism.
          </p>

          {/* Textarea */}
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={10}
            placeholder="Paste your text here..."
            className="w-full mt-6 rounded-xl border px-4 py-3"
          />

          <p className={`text-sm mt-2 ${text.length < MIN_LENGTH ? "text-red-500" : "text-green-500"}`}>
            {text.length}/{MIN_LENGTH} characters
          </p>

          {/* Button */}
          <button
            onClick={runCheck}
            disabled={loading || text.length < MIN_LENGTH}
            className="mt-6 w-full py-3 rounded-xl font-semibold text-white bg-indigo-600 disabled:bg-gray-400"
          >
            {loading ? "Scanning..." : "Scan for Plagiarism"}
          </button>

        </div>

        {/* RESULT SECTION */}

        {result && result.result && (

          <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">

            <h3 className="text-lg font-semibold">Results</h3>

            {/* Score */}
            <div
              className={`mt-4 text-5xl font-bold ${
                result.result.score > 40 ? "text-red-600" : "text-green-600"
              }`}
            >
              {result.result.score}%
            </div>

            <p className="text-gray-500 mt-1">
              Plagiarism Detected
            </p>

            {/* Sources */}
            {result.sources
              ?.filter((s) => s.score > 0)   
              .length > 0 && (

              <div className="mt-6">

                <h4 className="font-semibold mb-2">Sources</h4>

                {result.sources
                  .filter((s) => s.score > 0)
                  .map((s, i) => (

                    <div key={i} className="border-b py-2">

                      <a
                        href={s.url}
                        target="_blank"
                        className="text-indigo-600 hover:underline"
                      >
                        {s.title}
                      </a>

                      <p className="text-sm text-gray-500">
                        Score: {s.score}%
                      </p>

                    </div>

                ))}

              </div>

            )}

          </div>

        )}

      </div>

    </div>

  );
}
