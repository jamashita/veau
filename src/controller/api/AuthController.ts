import { Ambiguous, Kind } from '@jamashita/anden-type';
import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Body, Controller, Inject, Post, Req, Res } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { Type } from '../../container/Types';
import { AccountError } from '../../domain/vo/Account/error/AccountError';
import { EntranceInfoDTO } from '../../domain/vo/EntranceInformation/EntranceInfoDTO';
import { EntranceInformation } from '../../domain/vo/EntranceInformation/EntranceInformation';
import { VeauAccount } from '../../domain/vo/VeauAccount/VeauAccount';
import { ILogger } from '../../infrastructure/ILogger';
import { AuthenticationInteractor } from '../../interactor/AuthenticationInteractor';
import { NoSuchElementError } from '../../repository/query/error/NoSuchElementError';

@Controller('auth')
export class AuthController {
  private readonly authenticationInteractor: AuthenticationInteractor;
  private readonly logger: ILogger;

  public constructor(
    @Inject(Type.AuthenticationInteractor) authenticationInteractor: AuthenticationInteractor,
    @Inject(Type.Logger) logger: ILogger
  ) {
    this.authenticationInteractor = authenticationInteractor;
    this.logger = logger;
  }

  // TODO BODY CHECK
  @Post('/')
  public auth(@Body() entrancedDTO: EntranceInfoDTO, @Req() req: FastifyRequest, @Res() res: FastifyReply): void {
    const account: Ambiguous<VeauAccount> = req.session.get('VEAU');

    this.logger.trace(entrancedDTO);

    if (!Kind.isUndefined(account)) {
      res.status(StatusCodes.OK).send(account.toJSON()).send();

      return;
    }

    const info: EntranceInformation = EntranceInformation.ofJSON(entrancedDTO);

    this.authenticationInteractor.review(info.getAccount(), info.getPassword()).transform<void, Error>(
      (account: VeauAccount) => {
        this.logger.debug(`ACCOUNT FOUND: ${account.getVeauAccountID().toString()}`);

        // TODO REDIS
        req.session.set('session', account);

        res.status(StatusCodes.OK).send(account.toJSON());
      },
      (err: AccountError | DataSourceError | NoSuchElementError) => {
        this.logger.error(err);

        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
      }
    );
  }
}
