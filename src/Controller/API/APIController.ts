import { Express } from 'express';
import { useExpressServer } from 'routing-controllers';
import { AccountController } from './AccountController';
import { SessionController } from './SessionController';

export const APIController = (app: Express): Express => {
  return useExpressServer(app, {
    controllers: [
      AccountController,
      SessionController
    ]
  });
};
