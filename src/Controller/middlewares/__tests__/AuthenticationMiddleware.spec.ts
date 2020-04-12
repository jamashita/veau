import express from 'express';
import { OK, UNAUTHORIZED } from 'http-status';
import 'reflect-metadata';
import supertest from 'supertest';
import { kernel } from '../../../Container/Container';
import { TYPE } from '../../../Container/Types';
import { AuthenticationMiddleware } from '../AuthenticationMiddleware';

describe('AuthenticationMiddleware', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const authenticationMiddleware1: AuthenticationMiddleware = kernel.get<AuthenticationMiddleware>(TYPE.AuthenticationMiddleware);
      const authenticationMiddleware2: AuthenticationMiddleware = kernel.get<AuthenticationMiddleware>(TYPE.AuthenticationMiddleware);

      expect(authenticationMiddleware1).toBeInstanceOf(AuthenticationMiddleware);
      expect(authenticationMiddleware1).toBe(authenticationMiddleware2);
    });
  });

  describe('requires', () => {
    it('GET: pass', async () => {
      const authenticationMiddleware: AuthenticationMiddleware = kernel.get<AuthenticationMiddleware>(TYPE.AuthenticationMiddleware);
      const app: express.Express = express();
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        // @ts-ignore
        req.user = {};
        next();
      });
      app.use(authenticationMiddleware.requires());
      app.use((req: express.Request, res: express.Response) => {
        res.sendStatus(OK);
      });

      const response: supertest.Response = await supertest(app).get('/');
      expect(response.status).toEqual(OK);
    });

    it('GET: blocked', async () => {
      const authenticationMiddleware: AuthenticationMiddleware = kernel.get<AuthenticationMiddleware>(TYPE.AuthenticationMiddleware);
      const app: express.Express = express();
      app.use(authenticationMiddleware.requires());
      app.use((req: express.Request, res: express.Response) => {
        res.sendStatus(OK);
      });

      const response: supertest.Response = await supertest(app).get('/');
      expect(response.status).toEqual(UNAUTHORIZED);
    });

    it('POST: pass', async () => {
      const authenticationMiddleware: AuthenticationMiddleware = kernel.get<AuthenticationMiddleware>(TYPE.AuthenticationMiddleware);
      const app: express.Express = express();
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        // @ts-ignore
        req.user = {};
        next();
      });
      app.use(authenticationMiddleware.requires());
      app.use((req: express.Request, res: express.Response) => {
        res.sendStatus(OK);
      });

      const response: supertest.Response = await supertest(app).post('/');
      expect(response.status).toEqual(OK);
    });

    it('POST: blocked', async () => {
      const authenticationMiddleware: AuthenticationMiddleware = kernel.get<AuthenticationMiddleware>(TYPE.AuthenticationMiddleware);
      const app: express.Express = express();
      app.use(authenticationMiddleware.requires());
      app.use((req: express.Request, res: express.Response) => {
        res.sendStatus(OK);
      });

      const response: supertest.Response = await supertest(app).post('/');
      expect(response.status).toEqual(UNAUTHORIZED);
    });

    it('PUT: pass', async () => {
      const authenticationMiddleware: AuthenticationMiddleware = kernel.get<AuthenticationMiddleware>(TYPE.AuthenticationMiddleware);
      const app: express.Express = express();
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        // @ts-ignore
        req.user = {};
        next();
      });
      app.use(authenticationMiddleware.requires());
      app.use((req: express.Request, res: express.Response) => {
        res.sendStatus(OK);
      });

      const response: supertest.Response = await supertest(app).put('/');
      expect(response.status).toEqual(OK);
    });

    it('PUT: blocked', async () => {
      const authenticationMiddleware: AuthenticationMiddleware = kernel.get<AuthenticationMiddleware>(TYPE.AuthenticationMiddleware);
      const app: express.Express = express();
      app.use(authenticationMiddleware.requires());
      app.use((req: express.Request, res: express.Response) => {
        res.sendStatus(OK);
      });

      const response: supertest.Response = await supertest(app).put('/');
      expect(response.status).toEqual(UNAUTHORIZED);
    });

    it('DELETE: pass', async () => {
      const authenticationMiddleware: AuthenticationMiddleware = kernel.get<AuthenticationMiddleware>(TYPE.AuthenticationMiddleware);
      const app: express.Express = express();
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        // @ts-ignore
        req.user = {};
        next();
      });
      app.use(authenticationMiddleware.requires());
      app.use((req: express.Request, res: express.Response) => {
        res.sendStatus(OK);
      });

      const response: supertest.Response = await supertest(app).delete('/');
      expect(response.status).toEqual(OK);
    });

    it('DELETE: blocked', async () => {
      const authenticationMiddleware: AuthenticationMiddleware = kernel.get<AuthenticationMiddleware>(TYPE.AuthenticationMiddleware);
      const app: express.Express = express();
      app.use(authenticationMiddleware.requires());
      app.use((req: express.Request, res: express.Response) => {
        res.sendStatus(OK);
      });

      const response: supertest.Response = await supertest(app).delete('/');
      expect(response.status).toEqual(UNAUTHORIZED);
    });
  });
});
