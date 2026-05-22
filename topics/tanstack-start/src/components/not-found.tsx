import { Link } from '@tanstack/react-router';

export function NotFoundPage() {
  return (
    <div className="p-8">
      <div>Page not found</div>
      <Link className="button-link font-black" to="/">
        Go home
      </Link>
    </div>
  );
}
