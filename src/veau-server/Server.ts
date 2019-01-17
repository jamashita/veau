import * as http from 'http';
import * as path from 'path';
import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as helmet from 'helmet';
import * as compression from 'compression';
import * as expressSession from 'express-session';
import * as connectRedis from 'connect-redis';
import * as favicon from 'serve-favicon';
import * as assert from 'power-assert';
import * as log4js from 'log4js';
import * as config from 'config';
import 'source-map-support/register';
import {Controller} from '../veau-controller/Controller';
// import {AuthenticationService} from '../veau-service/AuthenticationService';
import {RedisStoreOptions} from 'connect-redis';

const port: number = config.get<number>('port');
const mode: string = process.env.NODE_ENV as string;
assert(mode !== undefined);

// logger
log4js.configure({
  appenders: {
    file: {
      type: 'dateFile',
      filename: 'logs/veau-web',
      pattern: '-yyyy-MM-dd.log',
      daysToKeep: 30,
      layout: {
        type: 'coloured'
      }
    },
    console: {
      type: 'console',
      layout: {
        type: 'coloured'
      }
    }
  },
  categories: {
    default: {
      appenders: [
        'file',
        'console'
      ],
      level: 'info'
    }
  },
  pm2: true
});

const logger = log4js.getLogger();
process.on('unhandledRejection', logger.fatal);

const app = express();
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

const server = http.createServer(app);
// AuthenticationService(app);
app.use('/', Controller);
server.listen(port, () => {
  logger.info(`Server running on port ${port} in ${mode} mode`);
});
