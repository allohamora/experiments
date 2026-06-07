import { createFileRoute, Link } from '@tanstack/react-router';
import { getAuthState } from '#/shared/api/auth';
import { getHealth } from '#/shared/api/health';

async function loader() {
  const [health, auth] = await Promise.all([getHealth(), getAuthState()]);

  return {
    title: 'SSR route',
    description:
      'This route renders per request, and its loader can run on the server during SSR or in the client during navigation.',
    auth,
    health,
    runtime: import.meta.env.SSR ? 'server' : 'client',
    renderedAt: new Date().toISOString(),
    requestMarker: Math.random().toString(36).slice(2, 10),
    transport: 'server loader: direct functions, client loader: server function endpoint',
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
            <p className="mt-2 text-sm font-black uppercase">loader runtime: {data.runtime}</p>
            <p className="mt-2 text-sm font-black uppercase">rendered at: {data.renderedAt}</p>
            <p className="mt-2 text-sm font-black uppercase">request marker: {data.requestMarker}</p>
            <p className="mt-2 text-sm font-black uppercase">health: {JSON.stringify(data.health)}</p>
          </section>

          <section className="border-4 border-black bg-white p-4">
            <p className="text-sm font-black uppercase">auth from loader</p>
            <div
              className={
                data.auth.status === 'signed in'
                  ? 'mt-4 border-4 border-black bg-[#c7f9cc] p-3'
                  : 'mt-4 border-4 border-black bg-[#ffb3b3] p-3'
              }
            >
              <p className="text-sm font-black uppercase">state: {data.auth.status}</p>
              {data.auth.user ? (
                <>
                  <p className="mt-2 break-words text-sm font-black uppercase">email: {data.auth.user.email}</p>
                  <p className="mt-2 break-words text-sm font-black uppercase">name: {data.auth.user.name}</p>
                  <p className="mt-2 break-words text-xs font-bold uppercase">session: {data.auth.session?.id}</p>
                  <p className="mt-2 break-words text-xs font-bold uppercase">
                    expires: {data.auth.session?.expiresAt}
                  </p>
                </>
              ) : null}
            </div>

            <div className="mt-4 border-t-4 border-black pt-4">
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
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
