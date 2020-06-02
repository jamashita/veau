import 'reflect-metadata';

import express, { Express, NextFunction, Request, Response } from 'express';
import { OK, UNAUTHORIZED } from 'http-status';
import supertest from 'supertest';

import { AuthenticationMiddleware } from '../AuthenticationMiddleware';

const setUser = (req: Request, res: Response, next: NextFunction): void => {
  req.user = {};
  next();
};

const ok = (req: Request, res: Response): void => {
  res.sendStatus(OK);
};

describe('AuthenticationMiddleware', () => {
  describe('requires', () => {
    it('GET: pass', async () => {
      const authenticationMiddleware: AuthenticationMiddleware = new AuthenticationMiddleware();
      const app: Express = express();

      app.use(setUser);
      app.use((req: Request, res: Response, next: NextFunction) => {
        authenticationMiddleware.use(req, res, next);
      });
      app.use(ok);

      const response: supertest.Response = await supertest(app).get('/');

      expect(response.status).toBe(OK);
    });

    it('GET: blocked', async () => {
      const authenticationMiddleware: AuthenticationMiddleware = new AuthenticationMiddleware();
      const app: Express = express();

      app.use((req: Request, res: Response, next: NextFunction) => {
        authenticationMiddleware.use(req, res, next);
      });
      app.use(ok);

      const response: supertest.Response = await supertest(app).get('/');

      expect(response.status).toBe(UNAUTHORIZED);
    });

    it('POST: pass', async () => {
      const authenticationMiddleware: AuthenticationMiddleware = new AuthenticationMiddleware();
      const app: Express = express();

      app.use(setUser);
      app.use((req: Request, res: Response, next: NextFunction) => {
        authenticationMiddleware.use(req, res, next);
      });
      app.use(ok);

      const response: supertest.Response = await supertest(app).post('/');

      expect(response.status).toBe(OK);
    });

    it('POST: blocked', async () => {
      const authenticationMiddleware: AuthenticationMiddleware = new AuthenticationMiddleware();
      const app: Express = express();

      app.use((req: Request, res: Response, next: NextFunction) => {
        authenticationMiddleware.use(req, res, next);
      });
      app.use(ok);

      const response: supertest.Response = await supertest(app).post('/');

      expect(response.status).toBe(UNAUTHORIZED);
    });

    it('PUT: pass', async () => {
      const authenticationMiddleware: AuthenticationMiddleware = new AuthenticationMiddleware();
      const app: Express = express();

      app.use(setUser);
      app.use((req: Request, res: Response, next: NextFunction) => {
        authenticationMiddleware.use(req, res, next);
      });
      app.use(ok);

      const response: supertest.Response = await supertest(app).put('/');

      expect(response.status).toBe(OK);
    });

    it('PUT: blocked', async () => {
      const authenticationMiddleware: AuthenticationMiddleware = new AuthenticationMiddleware();
      const app: Express = express();

      app.use((req: Request, res: Response, next: NextFunction) => {
        authenticationMiddleware.use(req, res, next);
      });
      app.use(ok);

      const response: supertest.Response = await supertest(app).put('/');

      expect(response.status).toBe(UNAUTHORIZED);
    });

    it('DELETE: pass', async () => {
      const authenticationMiddleware: AuthenticationMiddleware = new AuthenticationMiddleware();
      const app: Express = express();

      app.use(setUser);
      app.use((req: Request, res: Response, next: NextFunction) => {
        authenticationMiddleware.use(req, res, next);
      });
      app.use(ok);

      const response: supertest.Response = await supertest(app).delete('/');

      expect(response.status).toBe(OK);
    });

    it('DELETE: blocked', async () => {
      const authenticationMiddleware: AuthenticationMiddleware = new AuthenticationMiddleware();
      const app: Express = express();

      app.use((req: Request, res: Response, next: NextFunction) => {
        authenticationMiddleware.use(req, res, next);
      });
      app.use(ok);

      const response: supertest.Response = await supertest(app).delete('/');

      expect(response.status).toBe(UNAUTHORIZED);
    });
  });
});
