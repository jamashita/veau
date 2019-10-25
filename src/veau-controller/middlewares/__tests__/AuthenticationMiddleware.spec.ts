import express from 'express';
import { OK, UNAUTHORIZED } from 'http-status';
import 'jest';
import 'reflect-metadata';
import supertest from 'supertest';
import { container } from '../../../veau-container/Container';
import { TYPE } from '../../../veau-container/Types';
import { AuthenticationMiddleware } from '../AuthenticationMiddleware';

describe('AuthenticationMiddleware', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const authenticationMiddleware1: AuthenticationMiddleware = container.get<AuthenticationMiddleware>(TYPE.AuthenticationMiddleware);
      const authenticationMiddleware2: AuthenticationMiddleware = container.get<AuthenticationMiddleware>(TYPE.AuthenticationMiddleware);

      expect(authenticationMiddleware1).toBe(authenticationMiddleware2);
    });
  });

  describe('requires', () => {
    it('GET: pass', async () => {
      const authenticationMiddleware: AuthenticationMiddleware = container.get<AuthenticationMiddleware>(TYPE.AuthenticationMiddleware);
      const app: express.Express = express();
      app.use((req: express.Request, res: express.Response, next: express.NextFunction): void => {
        // @ts-ignore
        req.user = {};
        next();
      });
      app.use(authenticationMiddleware.requires());
      app.use((req: express.Request, res: express.Response): void => {
        res.sendStatus(OK);
      });

      const response: supertest.Response = await supertest(app).get('/');
      expect(response.status).toEqual(OK);
    });

    it('GET: blocked', async () => {
      const authenticationMiddleware: AuthenticationMiddleware = container.get<AuthenticationMiddleware>(TYPE.AuthenticationMiddleware);
      const app: express.Express = express();
      app.use(authenticationMiddleware.requires());
      app.use((req: express.Request, res: express.Response): void => {
        res.sendStatus(OK);
      });

      const response: supertest.Response = await supertest(app).get('/');
      expect(response.status).toEqual(UNAUTHORIZED);
    });

    it('POST: pass', async () => {
      const authenticationMiddleware: AuthenticationMiddleware = container.get<AuthenticationMiddleware>(TYPE.AuthenticationMiddleware);
      const app: express.Express = express();
      app.use((req: express.Request, res: express.Response, next: express.NextFunction): void => {
        // @ts-ignore
        req.user = {};
        next();
      });
      app.use(authenticationMiddleware.requires());
      app.use((req: express.Request, res: express.Response): void => {
        res.sendStatus(OK);
      });

      const response: supertest.Response = await supertest(app).post('/');
      expect(response.status).toEqual(OK);
    });

    it('POST: blocked', async () => {
      const authenticationMiddleware: AuthenticationMiddleware = container.get<AuthenticationMiddleware>(TYPE.AuthenticationMiddleware);
      const app: express.Express = express();
      app.use(authenticationMiddleware.requires());
      app.use((req: express.Request, res: express.Response): void => {
        res.sendStatus(OK);
      });

      const response: supertest.Response = await supertest(app).post('/');
      expect(response.status).toEqual(UNAUTHORIZED);
    });

    it('PUT: pass', async () => {
      const authenticationMiddleware: AuthenticationMiddleware = container.get<AuthenticationMiddleware>(TYPE.AuthenticationMiddleware);
      const app: express.Express = express();
      app.use((req: express.Request, res: express.Response, next: express.NextFunction): void => {
        // @ts-ignore
        req.user = {};
        next();
      });
      app.use(authenticationMiddleware.requires());
      app.use((req: express.Request, res: express.Response): void => {
        res.sendStatus(OK);
      });

      const response: supertest.Response = await supertest(app).put('/');
      expect(response.status).toEqual(OK);
    });

    it('PUT: blocked', async () => {
      const authenticationMiddleware: AuthenticationMiddleware = container.get<AuthenticationMiddleware>(TYPE.AuthenticationMiddleware);
      const app: express.Express = express();
      app.use(authenticationMiddleware.requires());
      app.use((req: express.Request, res: express.Response): void => {
        res.sendStatus(OK);
      });

      const response: supertest.Response = await supertest(app).put('/');
      expect(response.status).toEqual(UNAUTHORIZED);
    });

    it('DELETE: pass', async () => {
      const authenticationMiddleware: AuthenticationMiddleware = container.get<AuthenticationMiddleware>(TYPE.AuthenticationMiddleware);
      const app: express.Express = express();
      app.use((req: express.Request, res: express.Response, next: express.NextFunction): void => {
        // @ts-ignore
        req.user = {};
        next();
      });
      app.use(authenticationMiddleware.requires());
      app.use((req: express.Request, res: express.Response): void => {
        res.sendStatus(OK);
      });

      const response: supertest.Response = await supertest(app).delete('/');
      expect(response.status).toEqual(OK);
    });

    it('DELETE: blocked', async () => {
      const authenticationMiddleware: AuthenticationMiddleware = container.get<AuthenticationMiddleware>(TYPE.AuthenticationMiddleware);
      const app: express.Express = express();
      app.use(authenticationMiddleware.requires());
      app.use((req: express.Request, res: express.Response): void => {
        res.sendStatus(OK);
      });

      const response: supertest.Response = await supertest(app).delete('/');
      expect(response.status).toEqual(UNAUTHORIZED);
    });
  });
});
