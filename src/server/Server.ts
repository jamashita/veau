import { Ambiguous, Kind } from '@jamashita/anden-type';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import config from 'config';
import compress from 'fastify-compress';
import helmet from 'fastify-helmet';
import secureSession from 'fastify-secure-session';
import path from 'path';
import 'reflect-metadata';
import { BaseController } from '../controller/BaseController';
import { logger } from '../infrastructure/Logger';

const port: number = config.get<number>('port');
const mode: Ambiguous<string> = process.env['NODE_ENV'];

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

  app.useStaticAssets({
    root: path.resolve(__dirname, 'public'),
    prefix: '/'
  });
  app.setViewEngine({
    engine: {
      pug: true
    },
    templates: path.resolve('..', 'static', 'views')
  });
  await Promise.all([
    // @ts-ignore
    app.register(secureSession, {
      cookieName: 'VEAU',
      secret: 'zgp1tng0vzawgieau0zmolsbgh1r0kmxs40q35gjzbfcf2c8dmy57hnhlqjz3evq',
      salt: 'TbShH7BsJYk21AN8',
      cookie: {
        path: '/',
        httpOnly: true
      }
    }),
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
