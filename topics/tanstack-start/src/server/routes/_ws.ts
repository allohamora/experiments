import { defineWebSocketHandler } from 'nitro';

function send(peer: { send: (message: string) => void }, type: string, text: string) {
  peer.send(JSON.stringify({ type, text }));
}

export default defineWebSocketHandler({
  open(peer) {
    console.log('[server] open', peer.id);
    send(peer, 'system', 'server connected');
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
