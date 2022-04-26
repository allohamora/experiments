# ws experiment

- Nest uses `{ event: string, data: any }` pattern. Where event passed to @SubscribeMessage(event) and data passed to @MessageBody(). Example [here](/src/hi/hi.gateway.ts)
- By default Nest doesn't pass exception to client, just emit 'exception' event on client
- To listen ws server you need create and inject to nestjs app at least 1 WebSocketGateway
- To pass authorization you can use url params or custom ws adapter/library with this functional
- To send message to all client connection you can use connections hash map
- To check authorization and disconnect user if auth token is expired you can use connections hash map:
  - Before send event you check saved tokens in hash map
  - If token is expired generate { event: "unauthorized" } or similar and disconnect user
  - If tokes is ok just send event
