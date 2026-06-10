import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-sm">
        <p className="text-5xl font-medium text-gray-200 mb-4">404</p>
        <h2 className="text-lg font-medium text-gray-900 mb-2">
          Page not found
        </h2>
        <p className="text-sm text-gray-400 mb-6">
          The page you're looking for doesn't exist.
        </p>
        <Link
          href="/"
          className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
