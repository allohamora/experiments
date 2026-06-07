import { defineWebSocketHandler } from 'nitro';

import { auth } from '#/server/auth';

function send(peer: { send: (message: string) => void }, type: string, text: string) {
  peer.send(JSON.stringify({ type, text }));
}

async function getSession(peer: { request: Request }) {
  return auth.api.getSession({ headers: peer.request.headers });
}

function sendAuthError(peer: { send: (message: string) => void }) {
  send(
    peer,
    'error',
    JSON.stringify(
      {
        name: 'AuthRequiredError',
        message: 'WebSocket connection requires an authenticated session.',
        status: 401,
      },
      null,
      2,
    ),
  );
}

export default defineWebSocketHandler({
  async open(peer) {
    console.log('[server] open', peer.id);
    const session = await getSession(peer);

    if (!session) {
      sendAuthError(peer);
      peer.close(1008, 'Unauthorized');
      return;
    }

    peer.context.userId = session.user.id;
    send(peer, 'system', `server connected as ${session.user.email}`);
  },
  message(peer, message) {
    const text = message.text();
    console.log('[server] message', peer.id, text);

    if (text === 'ping') {
      send(peer, 'server', 'pong');
      return;
    }

    send(peer, 'server', `echo: ${text}`);
  },
  close(peer) {
    console.log('[server] close', peer.id);
  },
});
