"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error", error);
  }, [error]);

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-sm">
          <p className="text-4xl mb-4">⚠️</p>
          <h2 className="text-lg font-medium text-gray-900 mb-2">
            Something went wrong
          </h2>
          <p className="text-sm text-gray-400 mb-6">
            {error.message || "An unexpected error occurred"}
          </p>
          <button
            onClick={reset}
            className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    </>
  );
}
