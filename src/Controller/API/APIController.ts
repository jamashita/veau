import { Express } from 'express';
import { useExpressServer } from 'routing-controllers';
import { AccountController } from './AccountController';
import { AuthController } from './AuthController';
import { LocaleController } from './LocaleController';
import { SessionController } from './SessionController';

export const APIController = (app: Express): Express => {
  return useExpressServer(app, {
    routePrefix: '/api',
    controllers: [
      AccountController,
      AuthController,
      LocaleController,
      SessionController
    ]
  });
};
