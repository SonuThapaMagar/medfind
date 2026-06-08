"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

// This component uses useState and browser events (form submit).
// These only exist in the browser, not on the server.
// "use client" tells Next.js: run this in the browser, not the server.

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    console.log("signIn result:", result);

    if (result?.error) {
      setError("Invalid email or password");
      setLoading(false);
      return;
    }

    if (result?.ok) {
      router.push("/dashboard");
      router.refresh();
    }
    setLoading(false);
  }
  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        {/* Card */}
        <div className="w-full max-w-sm bg-white border border-gray-200 rounded-xl p-8">
          {/* Header */}
          <h1 className="text-xl font-medium text-gray-900 mb-1">Sign in</h1>
          <p className="text-sm text-gray-400 mb-6">MedFind Nepal</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-gray-600">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@medfind.com"
                required
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors text-black"
              />
            </div>

            {/* Password field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-gray-600">Password</label>

              {/* Wrapper — relative so eye button can be positioned inside */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-3 py-2 pr-10 text-sm border border-gray-200 rounded-lg outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors  text-black"
                />

                {/* Eye toggle button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  {showPassword ? (
                    // Eye-off — password is visible, click to hide
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    // Eye — password is hidden, click to show
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Error message — only renders when error is not empty */}
            {error && <p className="text-sm text-red-500">{error}</p>}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
            >
              {/* Spinner — only renders when loading */}
              {loading && (
                <svg
                  className="animate-spin"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
              )}
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="text-sm text-gray-400 text-center mt-4">
            Don't have an account?{" "}
            <Link href="/register" className="text-green-600 hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
