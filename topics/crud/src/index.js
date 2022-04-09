import { Server } from './server.js';
import { servePublic } from './handlers/serve-public.js';
import { bodyParser } from './middlewares/body-parser.js';
import { posts } from './handlers/posts.js';
import { langs } from './handlers/langs.js';
import { queryParser } from './middlewares/query-parser.js';

new Server().register(langs).register(posts).use(queryParser).register(servePublic).use(bodyParser).listen();
