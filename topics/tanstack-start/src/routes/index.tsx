import { createFileRoute, Link } from '@tanstack/react-router';
import { useRef, useState } from 'react';

import { getHealth } from '#/lib/api/client';

export const Route = createFileRoute('/')({ component: Home });

type ChatItem = {
  id: number;
  kind: 'client' | 'server' | 'system';
  text: string;
};

type SocketPayload = {
  type?: 'client' | 'server' | 'system';
  text?: string;
};

function Home() {
  const socketRef = useRef<WebSocket | null>(null);
  const nextIdRef = useRef(0);
  const [status, setStatus] = useState('disconnected');
  const [message, setMessage] = useState('ping');
  const [history, setHistory] = useState<ChatItem[]>([]);
  const [apiStatus, setApiStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [apiResult, setApiResult] = useState<string>('Not checked yet');

  function pushHistory(kind: ChatItem['kind'], text: string) {
    setHistory((current) => [
      ...current,
      {
        id: nextIdRef.current++,
        kind,
        text,
      },
    ]);
  }

  function connectSocket() {
    const currentSocket = socketRef.current;

    if (currentSocket?.readyState === WebSocket.OPEN || currentSocket?.readyState === WebSocket.CONNECTING) {
      return;
    }

    const socket = new WebSocket('ws://localhost:3000/_ws');
    socketRef.current = socket;
    setStatus('connecting');
    pushHistory('system', 'connecting...');

    socket.onopen = () => {
      if (socketRef.current !== socket) {
        return;
      }

      setStatus('connected');
      pushHistory('system', 'connected');
    };

    socket.onmessage = (event) => {
      try {
        const payload = JSON.parse(String(event.data)) as SocketPayload;
        pushHistory(payload.type ?? 'server', payload.text ?? String(event.data));
      } catch {
        pushHistory('server', String(event.data));
      }
    };

    socket.onerror = () => {
      if (socketRef.current !== socket) {
        return;
      }

      setStatus('error');
      pushHistory('system', 'error');
    };

    socket.onclose = () => {
      if (socketRef.current !== socket) {
        return;
      }

      socketRef.current = null;
      setStatus('disconnected');
      pushHistory('system', 'closed');
    };
  }

  function disconnectSocket() {
    const socket = socketRef.current;

    if (!socket) {
      return;
    }

    socketRef.current = null;
    setStatus('disconnected');
    pushHistory('system', 'closed');
    socket.close();
  }

  function sendText(text: string) {
    const socket = socketRef.current;
    const trimmed = text.trim();

    if (!trimmed || socket?.readyState !== WebSocket.OPEN) {
      return;
    }

    console.log('[client] send', trimmed);
    socket.send(trimmed);
    pushHistory('client', trimmed);
  }

  function sendMessage() {
    sendText(message);
    setMessage('');
  }

  async function checkApi() {
    setApiStatus('loading');
    setApiResult('Checking /api/health...');

    try {
      const result = await getHealth();
      setApiStatus('success');
      setApiResult(JSON.stringify(result));
    } catch (error) {
      setApiStatus('error');
      setApiResult(error instanceof Error ? error.message : 'Unknown error');
    }
  }

  return (
    <main className="min-h-screen bg-[#f4efe6] px-4 py-6 text-black">
      <div className="mx-auto max-w-4xl border-4 border-black bg-[#fff9ef] p-4 shadow-[10px_10px_0_#000] sm:p-6">
        <div className="border-4 border-black bg-[#ffd84d] px-4 py-3">
          <h1 className="text-3xl font-black uppercase sm:text-5xl">TanStack Start Nitro Demo</h1>
        </div>

        <div className="mt-4">
          <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
            <section className="border-4 border-black bg-white p-4">
              <div className="border-b-4 border-black pb-3">
                <h2 className="text-lg font-black uppercase">ws</h2>
                <div className="mt-2 flex items-center justify-between gap-4">
                  <p className="text-sm font-black uppercase">status: {status}</p>
                  <button
                    className="border-4 border-black bg-[#cde7ff] px-4 py-2 text-sm font-black uppercase shadow-[4px_4px_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                    onClick={status === 'connected' || status === 'connecting' ? disconnectSocket : connectSocket}
                    type="button"
                  >
                    {status === 'connected' || status === 'connecting' ? 'Disconnect' : 'Connect'}
                  </button>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex gap-2">
                  <input
                    className="min-w-0 flex-1 border-4 border-black bg-[#f7f3ea] px-3 py-3 text-base font-bold outline-none"
                    onChange={(event) => setMessage(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        sendMessage();
                      }
                    }}
                    placeholder="type ping or anything"
                    value={message}
                  />
                  <button
                    className="border-4 border-black bg-[#6ee7b7] px-4 py-3 text-sm font-black uppercase shadow-[4px_4px_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                    onClick={sendMessage}
                    type="button"
                  >
                    Send
                  </button>
                </div>

                <div className="min-h-80 border-4 border-black bg-[#fffdf8] p-3">
                  <div className="space-y-3">
                    {history.map((item) => (
                      <div
                        className={
                          item.kind === 'client'
                            ? 'border-4 border-black bg-[#c7f9cc] px-3 py-2'
                            : item.kind === 'server'
                              ? 'border-4 border-black bg-[#cde7ff] px-3 py-2'
                              : 'border-4 border-black bg-[#ffe599] px-3 py-2'
                        }
                        key={item.id}
                      >
                        <p className="text-xs font-black uppercase">{item.kind}</p>
                        <p className="mt-1 break-words text-base font-bold">{item.text}</p>
                      </div>
                    ))}
                    {history.length === 0 ? (
                      <div className="border-4 border-dashed border-black bg-transparent px-3 py-6 text-center text-sm font-bold uppercase">
                        No messages yet
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </section>

            <section className="border-4 border-black bg-white p-4">
              <div className="border-b-4 border-black pb-3">
                <h2 className="text-lg font-black uppercase">Hono</h2>
                <p className="mt-2 text-sm font-black uppercase">endpoint: /api/health</p>
              </div>

              <div className="mt-4 space-y-3">
                <a
                  className="button-link font-black block w-full border-4 border-black bg-[#7dd3fc] px-4 py-3 text-center text-black shadow-[4px_4px_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                  href="/api/swagger"
                  rel="noreferrer"
                  target="_blank"
                >
                  Swagger
                </a>

                <div className="grid gap-3 sm:grid-cols-2">
                  <Link
                    className="button-link block w-full border-4 border-black bg-[#ffd84d] px-4 py-3 text-center text-sm font-black uppercase text-black shadow-[4px_4px_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                    to="/prerender"
                  >
                    Prerender
                  </Link>
                  <Link
                    className="button-link block w-full border-4 border-black bg-[#c7f9cc] px-4 py-3 text-center text-sm font-black uppercase text-black shadow-[4px_4px_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                    to="/ssr"
                  >
                    SSR
                  </Link>
                </div>

                <button
                  className="w-full border-4 border-black bg-[#ff8a65] px-4 py-3 text-sm font-black uppercase shadow-[4px_4px_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none disabled:translate-x-0 disabled:translate-y-0 disabled:bg-[#f5b39f] disabled:shadow-[4px_4px_0_#000]"
                  disabled={apiStatus === 'loading'}
                  onClick={checkApi}
                  type="button"
                >
                  {apiStatus === 'loading' ? 'Checking...' : 'Check Hono'}
                </button>

                <div
                  className={
                    apiStatus === 'success'
                      ? 'border-4 border-black bg-[#c7f9cc] p-3'
                      : apiStatus === 'error'
                        ? 'border-4 border-black bg-[#ffb3b3] p-3'
                        : 'border-4 border-black bg-[#fff4cc] p-3'
                  }
                >
                  <p className="text-xs font-black uppercase">status: {apiStatus}</p>
                  <p className="mt-2 break-words font-bold">{apiResult}</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
