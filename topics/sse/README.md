# SSE

- nestjs sse can't send javascript object, before you send object you need stringified it (e.g. JSON.stringify)
- nestjs sse can consume only rxjs Observer
- you can use nodejs EventEmitter and rxjs fromEvent for creating Observers
