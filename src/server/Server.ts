import { Ambiguous, Kind } from '@jamashita/anden-type';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import config from 'config';
import { FastifyRegisterOptions } from 'fastify';
import secureSession, { SecureSessionPluginOptions } from 'fastify-secure-session';
import { FastifyPluginAsync } from 'fastify/types/plugin';
import 'reflect-metadata';
import { BaseController } from '../controller/BaseController';
import { log } from '../infrastructure/Logger';

const port: number = config.get<number>('port');
const mode: Ambiguous<string> = process.env['NODE_ENV'];
const session: FastifyRegisterOptions<unknown> = config.get<FastifyRegisterOptions<unknown>>('session');

if (Kind.isUndefined(mode)) {
  log.fatal('mode IS NOT SET');
  // eslint-disable-next-line no-process-exit,node/no-process-exit
  process.exit(1);
}

process.on('unhandledRejection', (reason: unknown) => {
  log.fatal('UNHANDLED REJECTION', reason);
});

const bootstrap = async (): Promise<unknown> => {
  const app: NestFastifyApplication = await NestFactory.create<NestFastifyApplication>(BaseController, new FastifyAdapter());

  // @ts-ignore
  await app.register(secureSession as FastifyPluginAsync<SecureSessionPluginOptions>, session);

  return app.listen(port);
};

bootstrap().then(() => {
  log.info(`Server running on port ${port} in ${mode} mode`);
});
