import { Express } from 'express';
import { useExpressServer } from 'routing-controllers';

import { APIController } from './API/APIController';
import { FEController } from './FE/FEController';

export const BaseController = (app: Express): Express => {
  useExpressServer<Express>(app, {
    routePrefix: '/',
    controllers: [FEController]
  });
  APIController(app);

  return app;
};
