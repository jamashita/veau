import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as config from 'config';
import * as connectRedis from 'connect-redis';
import * as express from 'express';
import * as expressSession from 'express-session';
import * as helmet from 'helmet';
import * as log4js from 'log4js';
import * as passport from 'passport';
import * as path from 'path';
import * as favicon from 'serve-favicon';
import 'source-map-support/register';
import { BaseController } from '../veau-controller/BaseController';
import '../veau-service/AuthenticationService';

const port: number = config.get<number>('port');
const mode: string = process.env.NODE_ENV as string;

log4js.configure(config.get<log4js.Configuration>('log4js'));
const logger: log4js.Logger = log4js.getLogger();

process.on('unhandledRejection', logger.fatal);

const app: express.Express = express();

app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
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
const sessionStore: expressSession.Store = new RedisStore(config.get<connectRedis.RedisStoreOptions>('redis'));
const sessionMiddleware: express.RequestHandler = expressSession({
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
app.use('/', BaseController);

app.listen(port, (): void => {
  logger.info(`Server running on port ${port} in ${mode} mode`);
});
