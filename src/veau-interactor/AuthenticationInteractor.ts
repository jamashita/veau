import { inject, injectable } from 'inversify';
import log4js from 'log4js';
import { VerifyFunction } from 'passport-local';
import { TYPE } from '../veau-container/Types';
import { AccountError } from '../veau-error/AccountError';
import { NoSuchElementError } from '../veau-error/NoSuchElementError';
import { DataSourceError } from '../veau-general/DataSourceError';
import { Digest } from '../veau-general/Digest';
import { Try } from '../veau-general/Try/Try';
import { IAccountQuery } from '../veau-query/Interfaces/IAccountQuery';
import { Account } from '../veau-vo/Account';
import { AccountName } from '../veau-vo/AccountName';
import { Password } from '../veau-vo/Password';
import { IInteractor } from './IInteractor';

const logger: log4js.Logger = log4js.getLogger();

const DUMMY_PASSWORD: string = '30DC7JzTgjAd8eXcwytlKCwI6kh1eqdU';
const DUMMY_HASH: string = '$2b$14$iyzp4FTxFklmPUjQMaNYcOO4Svv6kBEtphNseTlhWQ/SxV0VBKOa.';

@injectable()
export class AuthenticationInteractor implements IInteractor {
  public readonly noun: 'AuthenticationInteractor' = 'AuthenticationInteractor';
  public readonly accountQuery: IAccountQuery;

  public constructor(@inject(TYPE.AccountMySQLQuery) accountQuery: IAccountQuery) {
    this.accountQuery = accountQuery;
  }

  public review(): VerifyFunction {

    return async (name: string, pass: string, callback: (error: unknown, account?: unknown) => void): Promise<void> => {
      try {
        const accountName: AccountName = AccountName.of(name);
        const password: Password = Password.of(pass);

        const trial: Try<Account, AccountError | NoSuchElementError | DataSourceError> = await this.accountQuery.findByAccount(accountName);

        // eslint-disable-next-line @typescript-eslint/return-await
        return trial.match<Promise<void>>(async (account: Account) => {
          const correct: boolean = await account.verify(password);

          if (correct) {
            callback(null, account.toVeauAccount());
            return;
          }

          callback(null, false);
        }, async (err: AccountError | NoSuchElementError | DataSourceError) => {
          // time adjustment
          await Digest.compare(DUMMY_PASSWORD, DUMMY_HASH);

          logger.warn(err.message);
          logger.info(`invalid account: ${name} and password: ${pass}`);
          callback(null, false);
        });
      }
      catch (err) {
        logger.fatal(err.message);
        callback(err);
      }
    };
  }
}
