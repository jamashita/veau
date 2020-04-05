import { inject, injectable } from 'inversify';
import log4js from 'log4js';
import { VerifyFunction } from 'passport-local';
import { TYPE } from '../veau-container/Types';
import { NoSuchElementError } from '../veau-error/NoSuchElementError';
import { Digest } from '../veau-general/Digest';
import { Try } from '../veau-general/Try/Try';
import { AccountQuery } from '../veau-query/AccountQuery';
import { Account } from '../veau-vo/Account';
import { AccountName } from '../veau-vo/AccountName';
import { Password } from '../veau-vo/Password';

const logger: log4js.Logger = log4js.getLogger();

const DUMMY_PASSWORD: string = '30DC7JzTgjAd8eXcwytlKCwI6kh1eqdU';
const DUMMY_HASH: string = '$2b$14$iyzp4FTxFklmPUjQMaNYcOO4Svv6kBEtphNseTlhWQ/SxV0VBKOa.';

@injectable()
export class AuthenticationInteractor {
  public accountQuery: AccountQuery;

  public constructor(@inject(TYPE.AccountQuery) accountQuery: AccountQuery) {
    this.accountQuery = accountQuery;
  }

  public review(): VerifyFunction {

    return async (name: string, pass: string, callback: (error: unknown, account?: unknown) => void): Promise<void> => {
      try {
        const accountName: AccountName = AccountName.of(name);
        const password: Password = Password.of(pass);

        const trial: Try<Account, NoSuchElementError> = await this.accountQuery.findByAccount(accountName);

        await trial.match<Promise<void>>(async (account: Account) => {
          const correct: boolean = await account.verify(password);

          if (correct) {
            callback(null, account.toVeauAccount());
            return;
          }

          callback(null, false);
        }, async () => {
          // time adjustment
          await Digest.compare(DUMMY_PASSWORD, DUMMY_HASH);
          logger.info(`invalid account: ${name} and password: ${pass}`);
          callback(null, false);
          return;
        });
      }
      catch (err) {
        logger.fatal(err.message);
        callback(err);
      }
    };
  }
}
