import { createServer } from 'node:http';
import findMyWay from 'find-my-way';
import { ContentType, HttpError, Message, StatusCode } from './utils/http.js';

export class Server {
  #middlewares = [];
  #handlers = [];
  #port = 3000;
  #httpServer = null;
  #router = findMyWay();

  constructor({ port = 3000 } = {}) {
    this.#port = port;
  }

  register(handler) {
    this.#handlers.push(handler);

    return this;
  }

  use(middleware) {
    this.#middlewares.push(middleware);

    return this;
  }

  #replyFactory(res) {
    return ({ statusCode = StatusCode.Ok, data = Message.Ok, contentType = ContentType.Text }) => {
      if (typeof data === 'object' && data !== null) {
        data = JSON.stringify(data);
        contentType = ContentType.Json;
      }

      res.statusCode = statusCode;
      res.setHeader('Content-Type', contentType);
      res.end(data);
    };
  }

  async #createServer() {
    this.#httpServer = createServer(async (req, res) => {
      for (const middleware of this.#middlewares) {
        await middleware(req, res);
      }

      const reply = this.#replyFactory(res);
      const ctx = { req, res, server: this.#httpServer, router: this.#router, reply };
      const route = this.#router.find(req.method, req.url);

      if (route) {
        try {
          const returned = await route.handler({ ...ctx, params: route.params });

          if (returned) {
            reply({ data: returned });
          }
        } catch (error) {
          if (error instanceof HttpError) {
            reply({ ...error.toResponse() });
            return;
          }

          console.error(error);
          reply({ statusCode: StatusCode.InternalServerError, data: Message.InternalServerError });
        }
      }
    });

    for (const handler of this.#handlers) {
      await handler({ server: this.#httpServer, router: this.#router });
    }
  }

  async listen() {
    await this.#createServer();

    this.#httpServer.listen(this.#port, () => console.log(`server started at ${this.#port} port`));
  }
}
