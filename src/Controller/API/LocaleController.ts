import { Request, Response } from 'express';
import { INTERNAL_SERVER_ERROR, OK } from 'http-status';
import log4js from 'log4js';
import { DataSourceError, JSONable, Superposition } from 'publikum';
import { Controller, Delete, Get, Req, Res, UseBefore } from 'routing-controllers';
import { kernel } from '../../Container/Kernel';
import { TYPE } from '../../Container/Types';
import { LocaleError } from '../../Error/LocaleError';
import { LocaleInteractor } from '../../Interactor/LocaleInteractor';
import { AuthenticationMiddleware } from '../Middleware/AuthenticationMiddleware';

const logger: log4js.Logger = log4js.getLogger();

const authenticationMiddleware: AuthenticationMiddleware = kernel.get<AuthenticationMiddleware>(TYPE.AuthenticationMiddleware);
const localeInteractor: LocaleInteractor = kernel.get<LocaleInteractor>(TYPE.LocaleInteractor);

@Controller('/locale')
export class LocaleController {

  @Get('/')
  public async all(@Req() req: Request, @Res() res: Response): Promise<Response<unknown>> {
    const superposition: Superposition<JSONable, LocaleError | DataSourceError> = await localeInteractor.all();

    return superposition.match<Response<unknown>>((locale: JSONable) => {
      return res.status(OK).send(locale.toJSON());
    }, (err: LocaleError | DataSourceError) => {
      logger.error(err);

      return res.sendStatus(INTERNAL_SERVER_ERROR);
    });
  }

  @Delete('/')
  @UseBefore(authenticationMiddleware.requires())
  public async delete(@Req() req: Request, @Res() res: Response): Promise<Response<unknown>> {
    const superposition: Superposition<void, DataSourceError> = await localeInteractor.delete();

    return superposition.match<Response<unknown>>(() => {
      return res.sendStatus(OK);
    }, (err: DataSourceError) => {
      logger.error(err);

      return res.sendStatus(INTERNAL_SERVER_ERROR);
    });
  }
}
