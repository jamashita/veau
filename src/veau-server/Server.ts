import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as config from 'config';
import * as connectRedis from 'connect-redis';
import {RedisStoreOptions} from 'connect-redis';
import * as cookieParser from 'cookie-parser';
import {Express} from 'express';
import * as express from 'express';
import * as expressSession from 'express-session';
import * as helmet from 'helmet';
import {Configuration, Logger} from 'log4js';
import * as log4js from 'log4js';
import * as path from 'path';
import * as favicon from 'serve-favicon';
import 'source-map-support/register';
import {Controller} from '../veau-controller/Controller';
import {AuthenticationService} from '../veau-service/AuthenticationService';

log4js.configure(config.get<Configuration>('log4js'));

const port: number = config.get<number>('port');
const mode: string = process.env.NODE_ENV as string;
const logger: Logger = log4js.getLogger();

process.on('unhandledRejection', logger.fatal);

const app: Express = express();

app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());
app.use(cookieParser(config.get<string>('cookieParser')));
app.use(compression());
app.use(helmet());
app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.resolve(__dirname, 'public')));
app.use(favicon(path.resolve(__dirname, 'favicon.ico')));

const RedisStore = connectRedis(expressSession);
const sessionStore = new RedisStore(config.get<RedisStoreOptions>('redis'));
const sessionMiddleware = expressSession({
  secret: config.get<{secret: string}>('session').secret,
  store: sessionStore,
  resave: false,
  rolling: true,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 60 * 60 * 1000 * 8
  }
});

app.use(sessionMiddleware);

app.use(
  log4js.connectLogger(logger, {
    level: 'info',
    nolog: ['\\.css', '\\.js', '\\.jpeg', '\\.png', '\\.ttf', '\\.ico'],
    format: ':method :url :status'
  })
);

AuthenticationService(app);
app.use('/', Controller);
app.listen(port, () => {
  logger.info(`Server running on port ${port} in ${mode} mode`);
});
