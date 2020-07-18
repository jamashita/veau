import 'reflect-metadata';

import express, { Express, NextFunction, Request, Response } from 'express';
import { OK } from 'http-status';
import { useContainer, useExpressServer } from 'routing-controllers';
import supertest from 'supertest';

import { kernel } from '../../../Container/Kernel';
import { SessionController } from '../SessionController';

const dummy = (req: Request, _res: Response, next: NextFunction): void => {
  req.logout = () => {
    // NOOP
  };
  next();
};

describe('SessionController', () => {
  describe('DELETE /', () => {
    it('no session returns OK', async () => {
      const app: Express = express();

      useContainer(kernel);
      app.use(dummy);
      useExpressServer<Express>(app, {
        controllers: [SessionController]
      });

      const response: supertest.Response = await supertest(app).delete('/session');

      expect(response.status).toBe(OK);
    });
  });
});
