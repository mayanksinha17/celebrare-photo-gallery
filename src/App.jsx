import Gallery from './components/Gallery';

/**
 * App Component
 * 
 * Top-level application shell providing:
 * - Semantic header with title and concise description
 * - Main content container rendering the Gallery
 * - Semantic footer with project metadata
 */
function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Semantic Accessible Header */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Photo Gallery
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Curated photography powered by the Picsum API
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Gallery
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        <Gallery />
      </main>

      {/* Semantic Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4">
          <p>
            Celebrare Frontend React Assignment &bull; Built with React, Vite &amp; Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
