import { NextFunction, Request, Response } from 'express';
import { ExpressMiddlewareInterface } from 'routing-controllers';

export interface IMiddleware extends ExpressMiddlewareInterface {
  use(req: Request, res: Response, next: NextFunction): void;
}
