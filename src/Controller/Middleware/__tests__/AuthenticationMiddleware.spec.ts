import 'reflect-metadata';

import express, { Express, NextFunction, Request, Response } from 'express';
import { OK, UNAUTHORIZED } from 'http-status';
import supertest from 'supertest';

import { kernel } from '../../../Container/Kernel';
import { Type } from '../../../Container/Types';
import { AuthenticationMiddleware } from '../AuthenticationMiddleware';

const setUser = (req: Request, res: Response, next: NextFunction) => {
  req.user = {};
  next();
};

const ok = (req: Request, res: Response) => {
  res.sendStatus(OK);
};

describe('AuthenticationMiddleware', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const authenticationMiddleware1: AuthenticationMiddleware = kernel.get<AuthenticationMiddleware>(
        Type.AuthenticationMiddleware
      );
      const authenticationMiddleware2: AuthenticationMiddleware = kernel.get<AuthenticationMiddleware>(
        Type.AuthenticationMiddleware
      );

      expect(authenticationMiddleware1).toBeInstanceOf(AuthenticationMiddleware);
      expect(authenticationMiddleware1).toBe(authenticationMiddleware2);
    });
  });

  describe('requires', () => {
    it('GET: pass', async () => {
      const authenticationMiddleware: AuthenticationMiddleware = kernel.get<AuthenticationMiddleware>(
        Type.AuthenticationMiddleware
      );
      const app: Express = express();
      app.use(setUser);
      app.use(authenticationMiddleware.requires());
      app.use(ok);

      const response: supertest.Response = await supertest(app).get('/');
      expect(response.status).toBe(OK);
    });

    it('GET: blocked', async () => {
      const authenticationMiddleware: AuthenticationMiddleware = kernel.get<AuthenticationMiddleware>(
        Type.AuthenticationMiddleware
      );
      const app: Express = express();
      app.use(authenticationMiddleware.requires());
      app.use(ok);

      const response: supertest.Response = await supertest(app).get('/');
      expect(response.status).toBe(UNAUTHORIZED);
    });

    it('POST: pass', async () => {
      const authenticationMiddleware: AuthenticationMiddleware = kernel.get<AuthenticationMiddleware>(
        Type.AuthenticationMiddleware
      );
      const app: Express = express();
      app.use(setUser);
      app.use(authenticationMiddleware.requires());
      app.use(ok);

      const response: supertest.Response = await supertest(app).post('/');
      expect(response.status).toBe(OK);
    });

    it('POST: blocked', async () => {
      const authenticationMiddleware: AuthenticationMiddleware = kernel.get<AuthenticationMiddleware>(
        Type.AuthenticationMiddleware
      );
      const app: Express = express();
      app.use(authenticationMiddleware.requires());
      app.use(ok);

      const response: supertest.Response = await supertest(app).post('/');
      expect(response.status).toBe(UNAUTHORIZED);
    });

    it('PUT: pass', async () => {
      const authenticationMiddleware: AuthenticationMiddleware = kernel.get<AuthenticationMiddleware>(
        Type.AuthenticationMiddleware
      );
      const app: Express = express();
      app.use(setUser);
      app.use(authenticationMiddleware.requires());
      app.use(ok);

      const response: supertest.Response = await supertest(app).put('/');
      expect(response.status).toBe(OK);
    });

    it('PUT: blocked', async () => {
      const authenticationMiddleware: AuthenticationMiddleware = kernel.get<AuthenticationMiddleware>(
        Type.AuthenticationMiddleware
      );
      const app: Express = express();
      app.use(authenticationMiddleware.requires());
      app.use(ok);

      const response: supertest.Response = await supertest(app).put('/');
      expect(response.status).toBe(UNAUTHORIZED);
    });

    it('DELETE: pass', async () => {
      const authenticationMiddleware: AuthenticationMiddleware = kernel.get<AuthenticationMiddleware>(
        Type.AuthenticationMiddleware
      );
      const app: Express = express();
      app.use(setUser);
      app.use(authenticationMiddleware.requires());
      app.use(ok);

      const response: supertest.Response = await supertest(app).delete('/');
      expect(response.status).toBe(OK);
    });

    it('DELETE: blocked', async () => {
      const authenticationMiddleware: AuthenticationMiddleware = kernel.get<AuthenticationMiddleware>(
        Type.AuthenticationMiddleware
      );
      const app: Express = express();
      app.use(authenticationMiddleware.requires());
      app.use(ok);

      const response: supertest.Response = await supertest(app).delete('/');
      expect(response.status).toBe(UNAUTHORIZED);
    });
  });
});
