import * as express from 'express';

export interface IMiddleware {

  apply(req: express.Request, res: express.Response, next: express.NextFunction): any;
}
