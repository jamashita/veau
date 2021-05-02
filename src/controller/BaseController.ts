import { Express } from 'express';
import { useContainer, useExpressServer } from 'routing-controllers';
import { kernel } from '../container/Kernel';
import { APIController } from './api/APIController';
import { FEController } from './fe/FEController';

export const BaseController = (app: Express): Express => {
  useContainer(kernel);
  APIController(app);
  useExpressServer<Express>(app, {
    routePrefix: '/',
    controllers: [FEController]
  });

  return app;
};
