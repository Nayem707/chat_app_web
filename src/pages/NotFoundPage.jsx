import { Link } from 'react-router-dom';

export const NotFoundPage = () => (
  <main className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-6 text-center">
    <p className="text-sm font-semibold uppercase tracking-wider text-brand-500">404</p>
    <h1 className="mt-2 text-3xl font-semibold text-white">Page not found</h1>
    <Link
      to="/"
      className="mt-6 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
    >
      Go home
    </Link>
  </main>
);
