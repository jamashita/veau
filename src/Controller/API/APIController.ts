import { Express } from 'express';
import { useExpressServer } from 'routing-controllers';
import { AccountController } from './AccountController';
import { AuthController } from './AuthController';
import { LocaleController } from './LocaleController';
import { SessionController } from './SessionController';
import { StatsController } from './StatsController';

export const APIController = (app: Express): Express => {
  return useExpressServer<Express>(app, {
    routePrefix: '/api',
    controllers: [AccountController, AuthController, LocaleController, SessionController, StatsController]
  });
};
