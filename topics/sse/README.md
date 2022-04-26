# SSE

- nestjs sse can't send javascript object, before you send object you need stringified it (e.g. JSON.stringify)
- nestjs sse can consume only rxjs Observer
- you can use nodejs EventEmitter and rxjs fromEvent for creating Observers
- sse have 6 connections per page limit [source](https://stackoverflow.com/questions/5195452/websockets-vs-server-sent-events-eventsource). Because of that limit you can use [ws](../ws/) instead of sse
