# ws experiment

- Nest uses `{ event: string, data: any }` pattern. Where event passed to @SubscribeMessage(event) and data passed to @MessageBody(). Example [here](/src/hi/hi.gateway.ts)
- By default Nest doesn't pass exception to client, just emit 'exception' event on client
- To listen ws server you need create and inject to nestjs app at least 1 WebSocketGateway
- To pass authorization you can use:
  - url params e.g. ws://localhost?token=${token}
  - custom ws adapter/library with headers pass support on client (because of original [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/WebSocket) doesn't support that) and add auth handler on upgrade event with auth logic
- To send message to all client connection you can use connections hash map
- To check authorization and disconnect user if auth token is expired you can use connections hash map:
  - Before send event you check saved tokens in hash map
  - If token is expired generate { event: "unauthorized" } or similar and disconnect user
  - If tokes is ok just send event
- To subscribe user to some events you can use @SubscribeMessage(event) with returned rxjs Observable. Example [here](/src/ping/ping.gateway.ts)
- To split gateways for several connections you can use path (supported by ws) or namespace (supported only by socket.io). Examples [client](/public/index.html) and [server](/src/ping/ping.gateway.ts)
