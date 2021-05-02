import { Express } from 'express';
import { useContainer, useExpressServer } from 'routing-controllers';
import { cask } from '../container/Cask';
import { APIController } from './api/APIController';
import { FEController } from './fe/FEController';

export const BaseController = (app: Express): Express => {
  useContainer(cask);
  APIController(app);
  useExpressServer<Express>(app, {
    routePrefix: '/',
    controllers: [FEController]
  });

  return app;
};
