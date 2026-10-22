/**
 * LoadingSpinner Component
 * Displays a clean, accessible animated spinner while photos are being fetched.
 */
export default function LoadingSpinner() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center py-20 px-4 text-center"
    >
      <div className="relative w-14 h-14">
        {/* Outer subtle ring */}
        <div className="w-14 h-14 rounded-full border-4 border-slate-200"></div>
        {/* Spinning indicator ring */}
        <div className="w-14 h-14 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin absolute top-0 left-0"></div>
      </div>
      <p className="mt-4 text-base font-medium text-slate-600 animate-pulse">
        Loading photos from Picsum...
      </p>
      <span className="sr-only">Loading photos, please wait...</span>
    </div>
  );
}
