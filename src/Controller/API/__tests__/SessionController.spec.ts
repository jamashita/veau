import 'reflect-metadata';

import express, { Express, NextFunction, Request, Response } from 'express';
import { OK } from 'http-status';
import { useExpressServer } from 'routing-controllers';
import supertest from 'supertest';

import { kernel } from '../../../Container/Kernel';
import { Type } from '../../../Container/Types';
import { SessionController } from '../SessionController';

const dummy = (req: Request, res: Response, next: NextFunction): void => {
  req.logout = () => {
    // NOOP
  };
  next();
};

describe('SessionController', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const sessionController1: SessionController = kernel.get<SessionController>(Type.SessionController);
      const sessionController2: SessionController = kernel.get<SessionController>(Type.SessionController);

      expect(sessionController1).toBeInstanceOf(SessionController);
      expect(sessionController1).toBe(sessionController2);
    });
  });

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
