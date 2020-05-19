import 'reflect-metadata';

import express, { Express, NextFunction, Request, Response } from 'express';
import { OK } from 'http-status';
import { useExpressServer } from 'routing-controllers';
import supertest from 'supertest';

import { SessionController } from '../SessionController';

const dummy = (req: Request, res: Response, next: NextFunction) => {
  req.logout = () => {};
  next();
};

describe('SessionController', () => {
  describe('DELETE /', () => {
    it('no session returns OK', async () => {
      const app: Express = express();
      app.use(dummy);
      useExpressServer(app, {
        controllers: [SessionController]
      });

      const response: supertest.Response = await supertest(app).delete('/session');
      expect(response.status).toBe(OK);
    });
  });
});
