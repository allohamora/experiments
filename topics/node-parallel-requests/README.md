# node-parallel-requests

- Node.js can handle multiple requests per time by event loop
- Chromium based browsers send request one after another to the same url, because of that you can think that node.js cannot handle parallel requests, but it isn't true, it just chromium optimization (https://stackoverflow.com/questions/63681851/node-express-does-not-handle-parallel-requests)
