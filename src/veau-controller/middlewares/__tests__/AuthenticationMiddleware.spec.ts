import express from 'express';
import { OK, UNAUTHORIZED } from 'http-status';
import 'jest';
import supertest from 'supertest';
import { AuthenticationMiddleware } from '../AuthenticationMiddleware';

describe('AuthenticationMiddleware', () => {
  describe('requires', () => {
    it('GET: pass', async () => {
      const authenticationMiddleware: AuthenticationMiddleware = AuthenticationMiddleware.getInstance();
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
      const authenticationMiddleware: AuthenticationMiddleware = AuthenticationMiddleware.getInstance();
      const app: express.Express = express();
      app.use(authenticationMiddleware.requires());
      app.use((req: express.Request, res: express.Response): void => {
        res.sendStatus(OK);
      });

      const response: supertest.Response = await supertest(app).get('/');
      expect(response.status).toEqual(UNAUTHORIZED);
    });

    it('POST: pass', async () => {
      const authenticationMiddleware: AuthenticationMiddleware = AuthenticationMiddleware.getInstance();
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
      const authenticationMiddleware: AuthenticationMiddleware = AuthenticationMiddleware.getInstance();
      const app: express.Express = express();
      app.use(authenticationMiddleware.requires());
      app.use((req: express.Request, res: express.Response): void => {
        res.sendStatus(OK);
      });

      const response: supertest.Response = await supertest(app).post('/');
      expect(response.status).toEqual(UNAUTHORIZED);
    });

    it('PUT: pass', async () => {
      const authenticationMiddleware: AuthenticationMiddleware = AuthenticationMiddleware.getInstance();
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
      const authenticationMiddleware: AuthenticationMiddleware = AuthenticationMiddleware.getInstance();
      const app: express.Express = express();
      app.use(authenticationMiddleware.requires());
      app.use((req: express.Request, res: express.Response): void => {
        res.sendStatus(OK);
      });

      const response: supertest.Response = await supertest(app).put('/');
      expect(response.status).toEqual(UNAUTHORIZED);
    });

    it('DELETE: pass', async () => {
      const authenticationMiddleware: AuthenticationMiddleware = AuthenticationMiddleware.getInstance();
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
      const authenticationMiddleware: AuthenticationMiddleware = AuthenticationMiddleware.getInstance();
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
