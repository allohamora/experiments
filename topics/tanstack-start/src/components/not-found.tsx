import { Link } from '@tanstack/react-router';

export function NotFoundPage() {
  return (
    <div className="p-8">
      <div>Page not found</div>
      <Link to="/">Go home</Link>
    </div>
  );
}
