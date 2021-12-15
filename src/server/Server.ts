import { Ambiguous, Kind } from '@jamashita/anden-type';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import compression from 'compression';
import config from 'config';
import session from 'express-session';
import helmet from 'helmet';
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
  const app: NestExpressApplication = await NestFactory.create<NestExpressApplication>(BaseController, {
    logger
  });

  app.useStaticAssets(path.resolve(__dirname, 'public'));
  app.setBaseViewsDir(path.resolve(__dirname, 'views'));
  app.setViewEngine('pug');
  app.use(session({
    secret: 'zgp1tng0vzawgieau0zmolsbgh1r0kmxs40q35gjzbfcf2c8dmy57hnhlqjz3evq',
    resave: false,
    saveUninitialized: false
  }));
  app.use(helmet());
  app.use(compression());

  return app.listen(port);
};

bootstrap().then(() => {
  logger.info(`Server running on port ${port} in ${mode} mode`);
});
