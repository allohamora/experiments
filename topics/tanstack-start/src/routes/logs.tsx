import { createFileRoute, Link } from '@tanstack/react-router';

import type { LogsResponse } from '#/shared/api/logs';
import { getLogs } from '#/shared/api/logs';

async function loader(): Promise<LogsResponse> {
  return getLogs();
}

export const Route = createFileRoute('/logs')({
  loader,
  component: LogsPage,
});

function LogsPage() {
  const data = Route.useLoaderData();

  return (
    <main className="min-h-screen bg-[#f4efe6] px-4 py-6 text-black">
      <div className="mx-auto max-w-5xl border-4 border-black bg-[#fff9ef] p-4 shadow-[10px_10px_0_#000] sm:p-6">
        <div className="border-4 border-black bg-[#7dd3fc] px-4 py-3">
          <h1 className="text-3xl font-black uppercase sm:text-5xl">Request logs</h1>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            className="button-link border-4 border-black bg-[#ffd84d] px-4 py-3 text-sm font-black uppercase shadow-[4px_4px_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
            to="/"
          >
            Home
          </Link>
          <a
            className="button-link border-4 border-black bg-[#c7f9cc] px-4 py-3 text-sm font-black uppercase shadow-[4px_4px_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
            href="/api/logs"
            rel="noreferrer"
            target="_blank"
          >
            API JSON
          </a>
        </div>

        <section className="mt-4 border-4 border-black bg-white p-4">
          {data.logs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse text-left">
                <thead>
                  <tr className="border-b-4 border-black bg-[#fff4cc]">
                    <th className="px-3 py-2 text-xs font-black uppercase">Time</th>
                    <th className="px-3 py-2 text-xs font-black uppercase">Method</th>
                    <th className="px-3 py-2 text-xs font-black uppercase">Path</th>
                    <th className="px-3 py-2 text-xs font-black uppercase">Status</th>
                    <th className="px-3 py-2 text-xs font-black uppercase">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {data.logs.map((log) => (
                    <tr className="border-b-2 border-black last:border-b-0" key={log.id}>
                      <td className="px-3 py-3 text-sm font-bold">{new Date(log.createdAt).toLocaleString()}</td>
                      <td className="px-3 py-3 text-sm font-black uppercase">{log.method}</td>
                      <td className="px-3 py-3 text-sm font-bold">{log.path}</td>
                      <td className="px-3 py-3 text-sm font-black">{log.status}</td>
                      <td className="px-3 py-3 text-sm font-black">{log.durationMs}ms</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="border-4 border-dashed border-black px-3 py-8 text-center text-sm font-black uppercase">
              No request logs yet
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
