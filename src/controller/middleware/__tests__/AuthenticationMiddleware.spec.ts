import express, { Express } from 'express';
import { NextFunction, Request, RequestHandler, Response } from 'express-serve-static-core';
import { StatusCodes } from 'http-status-codes';
import 'reflect-metadata';
import { Controller, Delete, Get, Post, Put, Res, UseBefore, useExpressServer } from 'routing-controllers';
import supertest from 'supertest';
import { AuthenticationMiddleware } from '../AuthenticationMiddleware';

@Controller('/')
class MockController {
  @Delete('/')
  @UseBefore(AuthenticationMiddleware)
  public delete(@Res() res: Response): Response {
    return res.sendStatus(StatusCodes.OK);
  }

  @Get('/')
  @UseBefore(AuthenticationMiddleware)
  public get(@Res() res: Response): Response {
    return res.sendStatus(StatusCodes.OK);
  }

  @Post('/')
  @UseBefore(AuthenticationMiddleware)
  public post(@Res() res: Response): Response {
    return res.sendStatus(StatusCodes.OK);
  }

  @Put('/')
  @UseBefore(AuthenticationMiddleware)
  public put(@Res() res: Response): Response {
    return res.sendStatus(StatusCodes.OK);
  }
}

const setUser: RequestHandler = (req: Request, _res: Response, next: NextFunction): void => {
  req.user = {};
  next();
};

describe('AuthenticationMiddleware', () => {
  describe('requires', () => {
    it('gET: pass', async () => {
      expect.assertions(1);

      const app: Express = express();

      app.use(setUser);
      useExpressServer<Express>(app, {
        controllers: [MockController]
      });

      const response: supertest.Response = await supertest(app).get('/');

      expect(response.status).toBe(StatusCodes.OK);
    });

    it('gET: blocked', async () => {
      expect.assertions(1);

      const app: Express = express();

      useExpressServer<Express>(app, {
        controllers: [MockController]
      });

      const response: supertest.Response = await supertest(app).get('/');

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    });

    it('pOST: pass', async () => {
      expect.assertions(1);

      const app: Express = express();

      app.use(setUser);
      useExpressServer<Express>(app, {
        controllers: [MockController]
      });

      const response: supertest.Response = await supertest(app).post('/');

      expect(response.status).toBe(StatusCodes.OK);
    });

    it('pOST: blocked', async () => {
      expect.assertions(1);

      const app: Express = express();

      useExpressServer<Express>(app, {
        controllers: [MockController]
      });

      const response: supertest.Response = await supertest(app).post('/');

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    });

    it('pUT: pass', async () => {
      expect.assertions(1);

      const app: Express = express();

      app.use(setUser);
      useExpressServer<Express>(app, {
        controllers: [MockController]
      });

      const response: supertest.Response = await supertest(app).put('/');

      expect(response.status).toBe(StatusCodes.OK);
    });

    it('pUT: blocked', async () => {
      expect.assertions(1);

      const app: Express = express();

      useExpressServer<Express>(app, {
        controllers: [MockController]
      });

      const response: supertest.Response = await supertest(app).put('/');

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    });

    it('dELETE: pass', async () => {
      expect.assertions(1);

      const app: Express = express();

      app.use(setUser);
      useExpressServer<Express>(app, {
        controllers: [MockController]
      });

      const response: supertest.Response = await supertest(app).delete('/');

      expect(response.status).toBe(StatusCodes.OK);
    });

    it('dELETE: blocked', async () => {
      expect.assertions(1);

      const app: Express = express();

      useExpressServer<Express>(app, {
        controllers: [MockController]
      });

      const response: supertest.Response = await supertest(app).delete('/');

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    });
  });
});
