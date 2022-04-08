import { Server } from './server.js';
import { servePublic } from './handlers/serve-public.js';
import { bodyParser } from './middlewares/body-parser.js';
import { posts } from './handlers/posts.js';

new Server().register(servePublic).register(posts).use(bodyParser).listen();
