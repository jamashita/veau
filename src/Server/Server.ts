import { Ambiguous, Kind } from '@jamashita/anden-type';

import compression from 'compression';
import config from 'config';
import connectRedis from 'connect-redis';
import express, { Express, RequestHandler } from 'express';
import expressSession from 'express-session';
import helmet from 'helmet';
import passport from 'passport';
import path from 'path';
import 'reflect-metadata';
import favicon from 'serve-favicon';

import { BaseController } from '../Controller/BaseController';
import { logger } from '../Infrastructure/Logger';
import { veauRedis } from '../Infrastructure/VeauRedis';
import '../Service/AuthenticationService';

const port: number = config.get<number>('port');
// eslint-disable-next-line no-process-env
const mode: Ambiguous<string> = process.env.NODE_ENV;

if (Kind.isUndefined(mode)) {
  logger.fatal('mode IS NOT SET');
  // eslint-disable-next-line no-process-exit
  process.exit(1);
}

process.on('unhandledRejection', (reason: unknown) => {
  logger.fatal('UNHANDLED REJECTION');
  logger.fatal(reason);
});

const app: Express = express();

app.disable('x-powered-by');
app.set('views', path.resolve('static', 'views'));
app.set('view engine', 'pug');
app.use(
  express.urlencoded({
    extended: false
  })
);
app.use(express.json());
app.use(compression());
app.use(helmet());
app.use(express.static(path.resolve(__dirname, 'public')));
app.use(favicon(path.resolve('static', 'favicon.ico')));

const RedisStore: connectRedis.RedisStore = connectRedis(expressSession);
const sessionStore: expressSession.Store = new RedisStore({
  client: veauRedis.getClient(),
  prefix: 'veau::'
});
const sessionMiddleware: RequestHandler = expressSession({
  secret: 'Ziuye5J4VmwxacL7dvV98dqUqT7HbfTn',
  store: sessionStore,
  resave: false,
  rolling: true,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 1000 * 60 * 60 * 8
  }
});

app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

BaseController(app);

app.listen(port, () => {
  logger.info(`Server running on port ${port} in ${mode} mode`);
});
