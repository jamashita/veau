import express, { Express } from 'express';
import { NextFunction, Request, Response } from 'express-serve-static-core';
import { StatusCodes } from 'http-status-codes';
import 'reflect-metadata';
import { useContainer, useExpressServer } from 'routing-controllers';
import supertest from 'supertest';
import { cask } from '../../../container/Cask';
import { SessionController } from '../SessionController';

const dummy = (req: Request, _res: Response, next: NextFunction): void => {
  req.logout = () => {
    // NOOP
  };
  next();
};

describe.skip('SessionController', () => {
  describe('DELETE /', () => {
    it('no session returns OK', async () => {
      expect.assertions(1);

      const app: Express = express();

      useContainer(cask);
      app.use(dummy);
      useExpressServer<Express>(app, {
        controllers: [SessionController]
      });

      const response: supertest.Response = await supertest(app).delete('/session');

      expect(response.status).toBe(StatusCodes.OK);
    });
  });
});
