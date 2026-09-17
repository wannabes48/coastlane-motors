import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="bg-sky min-h-[calc(100vh-72px)] flex flex-col items-center justify-center text-center px-4 py-16">
      <h1 className="font-sans font-bold text-6xl text-ink mb-4">404</h1>
      <h2 className="font-sans font-semibold text-2xl text-ink mb-6">Page Not Found</h2>
      <p className="text-slate mb-8 max-w-md mx-auto">
        We couldn't find the page you were looking for. It might have been moved, or the vehicle may no longer be available.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/used" className="bg-azure text-white px-6 py-3 rounded-full font-semibold hover:bg-azure-ink transition-colors">
          Browse Used Cars
        </Link>
        <Link href="/" className="bg-white text-ink border border-line px-6 py-3 rounded-full font-semibold hover:border-ink transition-colors">
          Go to Homepage
        </Link>
      </div>
    </div>
  );
}
