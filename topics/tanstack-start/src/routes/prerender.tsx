import { createFileRoute, Link } from '@tanstack/react-router';
import { getHealth } from '#/shared/api/health';

async function loader() {
  const health = await getHealth();

  return {
    title: 'Prerender route',
    description:
      'This page is rendered at build time and uses a direct server function on the server and Hono over HTTP on the client.',
    health,
    generatedAt: new Date().toISOString(),
    transport: 'server: direct function, client: Hono /api',
  };
}

export const Route = createFileRoute('/prerender')({
  loader,
  component: PrerenderPage,
});

function PrerenderPage() {
  const data = Route.useLoaderData();

  return (
    <main className="min-h-screen bg-[#f4efe6] px-4 py-6 text-black">
      <div className="mx-auto max-w-4xl border-4 border-black bg-[#fff9ef] p-4 shadow-[10px_10px_0_#000] sm:p-6">
        <div className="border-4 border-black bg-[#ffd84d] px-4 py-3">
          <h1 className="text-3xl font-black uppercase sm:text-5xl">{data.title}</h1>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="border-4 border-black bg-white p-4">
            <p className="text-base font-bold">{data.description}</p>
            <p className="mt-4 text-sm font-black uppercase">transport: {data.transport}</p>
            <p className="mt-2 text-sm font-black uppercase">generated at: {data.generatedAt}</p>
            <p className="mt-2 text-sm font-black uppercase">health: {JSON.stringify(data.health)}</p>
          </section>

          <section className="border-4 border-black bg-white p-4">
            <p className="text-sm font-black uppercase">routes</p>
            <div className="mt-4 space-y-3">
              <Link
                className="button-link block border-4 border-black bg-[#cde7ff] px-4 py-3 text-center text-sm font-black uppercase shadow-[4px_4px_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                to="/"
              >
                Home
              </Link>
              <Link
                className="button-link block border-4 border-black bg-[#c7f9cc] px-4 py-3 text-center text-sm font-black uppercase shadow-[4px_4px_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                to="/ssr"
              >
                Open SSR route
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
