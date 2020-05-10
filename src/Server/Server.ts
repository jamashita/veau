import compression from 'compression';
import config from 'config';
import connectRedis from 'connect-redis';
import express, { Express, RequestHandler } from 'express';
import expressSession from 'express-session';
import helmet from 'helmet';
import log4js from 'log4js';
import passport from 'passport';
import path from 'path';
import { Ambiguous } from 'publikum';
import 'reflect-metadata';
import { useExpressServer } from 'routing-controllers';
import favicon from 'serve-favicon';
import 'source-map-support/register';
import { APIController } from '../Controller/API/APIController';
import { FEController } from '../Controller/FE/FEController';
import { veauRedis } from '../Infrastructure/VeauRedis';
import '../Service/AuthenticationService';

const port: number = config.get<number>('port');
const mode: Ambiguous<string> = process.env.NODE_ENV;

log4js.configure(config.get<log4js.Configuration>('log4js'));
const logger: log4js.Logger = log4js.getLogger();

if (mode === undefined) {
  logger.fatal('mode IS NOT SET');
  process.exit(1);
}

process.on('unhandledRejection', (reason: unknown) => {
  logger.fatal('UNHANDLED REJECTION');
  logger.fatal(reason);
});

const app: Express = express();

app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.urlencoded({
  extended: false
}));
app.use(express.json());
app.use(compression());
app.use(helmet());
app.use(express.static(path.resolve(__dirname, 'public')));
app.use(favicon(path.resolve(__dirname, 'favicon.ico')));
app.use(log4js.connectLogger(logger, {
  level: 'info',
  nolog: [
    '\\.css',
    '\\.js',
    '\\.jpeg',
    '\\.png',
    '\\.ttf',
    '\\.ico'
  ],
  format: ':method :url :status'
}));

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

useExpressServer<Express>(app, {
  routePrefix: '/',
  controllers: [
    FEController
  ]
});

APIController(api);

app.listen(port, () => {
  logger.info(`Server running on port ${port} in ${mode} mode`);
});
