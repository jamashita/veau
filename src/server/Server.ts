import { Ambiguous, Kind, Nullable } from '@jamashita/anden-type';
import config from 'config';
import ffy, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import 'reflect-metadata';
import { log } from '../infrastructure/Logger';

const fastify: FastifyInstance = ffy({
  logger: log
});

const port: number = config.get<number>('port');
// eslint-disable-next-line no-process-env
const mode: Ambiguous<string> = process.env['NODE_ENV'];

if (Kind.isUndefined(mode)) {
  log.fatal('mode IS NOT SET');
  // eslint-disable-next-line no-process-exit,node/no-process-exit
  process.exit(1);
}

process.on('unhandledRejection', (reason: unknown) => {
  log.fatal('UNHANDLED REJECTION', reason);
});

fastify.get('/:id', async (request: FastifyRequest, reply: FastifyReply) => {
  await reply.send({
    p: request.query,
    q: request.params
  });
});

fastify.listen(port, (err: Nullable<Error>) => {
  if (Kind.isNull(err)) {
    log.info(`Server running on port ${port} in ${mode} mode`);

    return;
  }

  log.error(err);
  // eslint-disable-next-line node/no-process-exit,no-process-exit
  process.exit(1);
});

// const app: Express = express();
//
// app.disable('x-powered-by');
// app.set('views', path.resolve('static', 'views'));
// app.set('view engine', 'pug');
// app.use(
//   express.urlencoded({
//     extended: false
//   })
// );
// app.use(express.json());
// app.use(compression());
// app.use(helmet());
// app.use(express.static(path.resolve(__dirname, 'public')));
// app.use(favicon(path.resolve('static', 'favicon.ico')));
//
// const RedisStore: connectRedis.RedisStore = connectRedis(expressSession);
// const sessionStore: expressSession.Store = new RedisStore({
//   client: veauRedis.getClient(),
//   prefix: 'veau::'
// });
// const sessionMiddleware: RequestHandler = expressSession({
//   secret: 'Ziuye5J4VmwxacL7dvV98dqUqT7HbfTn',
//   store: sessionStore,
//   resave: false,
//   rolling: true,
//   saveUninitialized: false,
//   cookie: {
//     httpOnly: true,
//     secure: false,
//     maxAge: 1000 * 60 * 60 * 8
//   }
// });
//
// app.use(sessionMiddleware);
// app.use(passport.initialize());
// app.use(passport.session());
//
// BaseController(app);
//
// app.listen(port, () => {
//   logger.info(`Server running on port ${port} in ${mode} mode`);
// });
