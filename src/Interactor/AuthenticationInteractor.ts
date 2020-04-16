import { inject, injectable } from 'inversify';
import log4js from 'log4js';
import { VerifyFunction } from 'passport-local';
import { TYPE } from '../Container/Types';
import { AccountError } from '../Error/AccountError';
import { NoSuchElementError } from '../Error/NoSuchElementError';
import { DataSourceError } from '../General/DataSourceError';
import { Digest } from '../General/Digest';
import { Noun } from '../General/Interface/Noun';
import { Superposition } from '../General/Superposition/Superposition';
import { IAccountQuery } from '../Query/Interface/IAccountQuery';
import { Account } from '../VO/Account';
import { AccountName } from '../VO/AccountName';
import { Password } from '../VO/Password';

const logger: log4js.Logger = log4js.getLogger();

const DUMMY_PASSWORD: string = '30DC7JzTgjAd8eXcwytlKCwI6kh1eqdU';
const DUMMY_HASH: string = '$2b$14$iyzp4FTxFklmPUjQMaNYcOO4Svv6kBEtphNseTlhWQ/SxV0VBKOa.';

@injectable()
export class AuthenticationInteractor implements Noun {
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

        const trial: Superposition<Account, AccountError | NoSuchElementError | DataSourceError> = await this.accountQuery.findByAccount(accountName);

        // eslint-disable-next-line @typescript-eslint/return-await
        return trial.match<void>(async (account: Account) => {
          const correct: boolean = await account.verify(password);

          if (correct) {
            callback(null, account.toVeauAccount());
            return;
          }

          callback(null, false);
        }, async (err: AccountError | NoSuchElementError | DataSourceError) => {
          // time adjustment
          await Digest.compare(DUMMY_PASSWORD, DUMMY_HASH);

          logger.warn(err);
          logger.info(`invalid account: ${name} and password: ${pass}`);
          callback(null, false);
        });
      }
      catch (err) {
        logger.fatal(err);
        callback(err);
      }
    };
  }
}
