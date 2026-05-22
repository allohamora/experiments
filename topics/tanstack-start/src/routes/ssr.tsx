import { createFileRoute, Link } from '@tanstack/react-router';
import { getApi } from '#/shared/orpc/api';

async function loader() {
  const api = await getApi();
  const health = await api.health();

  return {
    title: 'SSR route',
    description:
      'This page renders per request and uses direct oRPC on the server and OpenAPI over HTTP on the client.',
    health,
    renderedAt: new Date().toISOString(),
    requestMarker: Math.random().toString(36).slice(2, 10),
    transport: 'server: direct oRPC, client: /api OpenAPI',
  };
}

export const Route = createFileRoute('/ssr')({
  loader,
  component: SsrPage,
});

function SsrPage() {
  const data = Route.useLoaderData();

  return (
    <main className="min-h-screen bg-[#f4efe6] px-4 py-6 text-black">
      <div className="mx-auto max-w-4xl border-4 border-black bg-[#fff9ef] p-4 shadow-[10px_10px_0_#000] sm:p-6">
        <div className="border-4 border-black bg-[#ff8a65] px-4 py-3">
          <h1 className="text-3xl font-black uppercase sm:text-5xl">{data.title}</h1>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="border-4 border-black bg-white p-4">
            <p className="text-base font-bold">{data.description}</p>
            <p className="mt-4 text-sm font-black uppercase">transport: {data.transport}</p>
            <p className="mt-2 text-sm font-black uppercase">rendered at: {data.renderedAt}</p>
            <p className="mt-2 text-sm font-black uppercase">request marker: {data.requestMarker}</p>
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
                className="button-link block border-4 border-black bg-[#ffd84d] px-4 py-3 text-center text-sm font-black uppercase shadow-[4px_4px_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                to="/prerender"
              >
                Open prerender route
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
