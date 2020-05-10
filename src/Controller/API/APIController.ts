import { Express } from 'express';
import { useExpressServer } from 'routing-controllers';
import { SessionController } from './SessionController';

export const APIController = (app: Express): Express => {
  return useExpressServer(app, {
    controllers: [
      SessionController
    ]
  });
};
