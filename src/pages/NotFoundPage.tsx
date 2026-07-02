import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-16 text-center text-slate-100 sm:px-6">
      <div className="mx-auto max-w-2xl rounded-[2rem] border border-slate-800 bg-slate-900/95 p-12 shadow-xl shadow-slate-950/20">
        <p className="text-sm uppercase tracking-[0.3em] text-sky-400/80">Page not found</p>
        <h1 className="mt-6 text-5xl font-semibold text-white">404</h1>
        <p className="mt-4 text-slate-400">We couldn’t find the page you’re looking for.</p>
        <Link to="/" className="mt-8 inline-flex rounded-3xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-500">
          Return to dashboard
        </Link>
      </div>
    </main>
  );
}
