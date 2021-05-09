import { Ambiguous, Kind } from '@jamashita/anden-type';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import config from 'config';
import { FastifyRegisterOptions } from 'fastify';
import compress from 'fastify-compress';
import helmet from 'fastify-helmet';
import secureSession from 'fastify-secure-session';
import path from 'path';
import 'reflect-metadata';
import { BaseController } from '../controller/BaseController';
import { logger } from '../infrastructure/Logger';

const port: number = config.get<number>('port');
const mode: Ambiguous<string> = process.env['NODE_ENV'];
const session: FastifyRegisterOptions<unknown> = config.get<FastifyRegisterOptions<unknown>>('session');

if (Kind.isUndefined(mode)) {
  logger.fatal('mode IS NOT SET');
  // eslint-disable-next-line no-process-exit,node/no-process-exit
  process.exit(1);
}

process.on('unhandledRejection', (reason: unknown) => {
  logger.fatal('UNHANDLED REJECTION');
  logger.fatal(reason);
});

const bootstrap = async (): Promise<unknown> => {
  const app: NestFastifyApplication = await NestFactory.create<NestFastifyApplication>(BaseController, new FastifyAdapter(), {
    logger
  });

  // app.set('views', path.resolve('static', 'views'));
  // app.set('view engine', 'pug');
  // app.use(express.static(path.resolve(__dirname, 'public')));
  // app.use(favicon(path.resolve('static', 'favicon.ico')));
  app.useStaticAssets({
    root: path.join(__dirname, 'public'),
    prefix: '/'
  });
  app.setViewEngine({
    engine: {
      pug: true
    },
    templates: path.join('static', 'views')
  });
  await Promise.all([
    // @ts-ignore
    app.register(secureSession, session),
    // @ts-ignore
    app.register(helmet),
    // @ts-ignore
    app.register(compress)
  ]);

  return app.listen(port);
};

bootstrap().then(() => {
  logger.info(`Server running on port ${port} in ${mode} mode`);
});
