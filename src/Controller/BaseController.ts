import { Express } from 'express';
import { useContainer, useExpressServer } from 'routing-controllers';

import { kernel } from '../Container/Kernel';
import { APIController } from './API/APIController';
import { FEController } from './FE/FEController';

export const BaseController = (app: Express): Express => {
  useContainer(kernel);
  useExpressServer<Express>(app, {
    routePrefix: '/',
    controllers: [FEController]
  });
  APIController(app);

  return app;
};
