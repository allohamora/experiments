import { createFileRoute, Link } from '@tanstack/react-router';
import { useRef, useState } from 'react';

import { getHealth } from '#/lib/api/client';
import { authClient } from '#/lib/auth/client';

export const Route = createFileRoute('/')({ component: Home });

type ChatItem = {
  id: number;
  kind: 'client' | 'server' | 'system' | 'error';
  text: string;
};

type SocketPayload = {
  type?: 'client' | 'server' | 'system' | 'error';
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
  const [authStatus, setAuthStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const session = authClient.useSession();

  const clientSideMessage = import.meta.env.VITE_CLIENT_SIDE_MESSAGE ?? 'Not set';
  const demoUser = {
    email: 'demo@example.com',
    name: 'Demo User',
    password: 'demo-password-123456',
  };

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
    setHistory([]);
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
    setHistory([]);
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
      setApiResult(JSON.stringify(result, null, 2));
    } catch (error) {
      setApiStatus('error');
      setApiResult(error instanceof Error ? error.message : 'Unknown error');
    }
  }

  async function login() {
    setAuthStatus('loading');

    try {
      await authClient.signUp.email(demoUser).catch(() => null);
      await authClient.signIn.email({
        email: demoUser.email,
        password: demoUser.password,
      });
      await session.refetch();
      setAuthStatus('success');
    } catch (error) {
      setAuthStatus('error');
      console.error(error);
    }
  }

  async function logout() {
    setAuthStatus('loading');

    try {
      disconnectSocket();
      await authClient.signOut();
      await session.refetch();
      setAuthStatus('success');
    } catch (error) {
      setAuthStatus('error');
      console.error(error);
    }
  }

  return (
    <main className="min-h-screen bg-[#f4efe6] px-4 py-6 text-black">
      <div className="mx-auto flex h-[calc(100svh-3rem)] min-h-[760px] max-w-4xl flex-col overflow-hidden border-4 border-black bg-[#fff9ef] p-4 shadow-[10px_10px_0_#000] sm:p-6">
        <div className="shrink-0 border-4 border-black bg-[#ffd84d] px-4 py-3">
          <h1 className="text-3xl font-black uppercase sm:text-5xl">TanStack Start Nitro Demo</h1>
        </div>

        <section className="mt-4 shrink-0 border-4 border-black bg-[#fffdf8] p-4">
          <h2 className="text-lg font-black uppercase">Auth</h2>
          <p className="mt-2 line-clamp-2 break-words text-sm font-black uppercase">
            {authStatus === 'error'
              ? 'state: error'
              : session.isPending
                ? 'state: loading'
                : session.data
                  ? `state: signed in / ${session.data.user.email}`
                  : 'state: signed out'}
          </p>

          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <button
              className="border-4 border-black bg-[#6ee7b7] px-3 py-3 text-sm font-black uppercase shadow-[4px_4px_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none disabled:translate-x-0 disabled:translate-y-0 disabled:bg-[#b7ead6] disabled:shadow-[4px_4px_0_#000]"
              disabled={authStatus === 'loading'}
              onClick={login}
              type="button"
            >
              Login
            </button>
            <button
              className="border-4 border-black bg-[#ffb3b3] px-3 py-3 text-sm font-black uppercase shadow-[4px_4px_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none disabled:translate-x-0 disabled:translate-y-0 disabled:bg-[#f2cdcd] disabled:shadow-[4px_4px_0_#000]"
              disabled={authStatus === 'loading' || !session.data}
              onClick={logout}
              type="button"
            >
              Logout
            </button>
            <a
              className="button-link border-4 border-black bg-[#cde7ff] px-3 py-3 text-center text-sm font-black uppercase text-black shadow-[4px_4px_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
              href="/api/users/me"
              rel="noreferrer"
              target="_blank"
            >
              Me
            </a>
          </div>
        </section>

        <div className="mt-4 min-h-0 flex-1">
          <div className="grid h-full min-h-0 grid-rows-[minmax(0,1fr)_minmax(0,1fr)] gap-4 lg:grid-cols-[1.5fr_1fr] lg:grid-rows-none">
            <section className="flex min-h-0 flex-col border-4 border-black bg-white p-4">
              <div className="shrink-0 border-b-4 border-black pb-3">
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

              <div className="mt-4 flex min-h-0 flex-1 flex-col gap-3">
                <div className="flex shrink-0 gap-2">
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
                    className="border-4 border-black bg-[#6ee7b7] px-4 py-3 text-sm font-black uppercase shadow-[4px_4px_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none disabled:translate-x-0 disabled:translate-y-0 disabled:bg-[#b7ead6] disabled:shadow-[4px_4px_0_#000]"
                    disabled={status !== 'connected'}
                    onClick={sendMessage}
                    type="button"
                  >
                    Send
                  </button>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto border-4 border-black bg-[#fffdf8] p-3">
                  <div className="space-y-3">
                    {history.map((item) => (
                      <div
                        className={
                          item.kind === 'client'
                            ? 'border-4 border-black bg-[#c7f9cc] px-3 py-2'
                            : item.kind === 'server'
                              ? 'border-4 border-black bg-[#cde7ff] px-3 py-2'
                              : item.kind === 'error'
                                ? 'border-4 border-black bg-[#ffb3b3] px-3 py-2'
                                : 'border-4 border-black bg-[#ffe599] px-3 py-2'
                        }
                        key={item.id}
                      >
                        <p className="text-xs font-black uppercase">{item.kind}</p>
                        <pre className="mt-1 whitespace-pre-wrap break-words font-mono text-sm font-bold">
                          {item.text}
                        </pre>
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

            <section className="flex min-h-0 flex-col overflow-hidden border-4 border-black bg-white p-4">
              <div className="shrink-0 border-b-4 border-black pb-3">
                <h2 className="text-lg font-black uppercase">Hono</h2>
                <p className="mt-2 text-sm font-black uppercase">endpoint: /api/health</p>
              </div>

              <div className="mt-4 flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pr-1">
                <a
                  className="button-link font-black block w-full shrink-0 border-4 border-black bg-[#7dd3fc] px-4 py-3 text-center text-black shadow-[4px_4px_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                  href="/api/swagger"
                  rel="noreferrer"
                  target="_blank"
                >
                  Swagger
                </a>

                <div className="grid shrink-0 gap-3 sm:grid-cols-2">
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
                  <Link
                    className="button-link block w-full border-4 border-black bg-[#fff4cc] px-4 py-3 text-center text-sm font-black uppercase text-black shadow-[4px_4px_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                    to="/logs"
                  >
                    Logs
                  </Link>
                  <button
                    className="w-full border-4 border-black bg-[#ff8a65] px-4 py-3 text-sm font-black uppercase shadow-[4px_4px_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none disabled:translate-x-0 disabled:translate-y-0 disabled:bg-[#f5b39f] disabled:shadow-[4px_4px_0_#000]"
                    disabled={apiStatus === 'loading'}
                    onClick={checkApi}
                    type="button"
                  >
                    {apiStatus === 'loading' ? 'Checking...' : 'Check Hono'}
                  </button>
                </div>

                <div
                  className={
                    apiStatus === 'success'
                      ? 'min-h-32 shrink-0 overflow-y-auto border-4 border-black bg-[#c7f9cc] p-3'
                      : apiStatus === 'error'
                        ? 'min-h-32 shrink-0 overflow-y-auto border-4 border-black bg-[#ffb3b3] p-3'
                        : 'min-h-32 shrink-0 overflow-y-auto border-4 border-black bg-[#fff4cc] p-3'
                  }
                >
                  <p className="text-xs font-black uppercase">status: {apiStatus}</p>
                  <pre className="mt-2 whitespace-pre-wrap break-words font-mono text-xs font-bold">{apiResult}</pre>
                </div>

                <div className="shrink-0 border-4 border-black bg-[#f7f3ea] p-3">
                  <p className="text-xs font-black uppercase">client env</p>
                  <p className="mt-2 break-words font-bold">{clientSideMessage}</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
