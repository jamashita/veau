import { inject, injectable } from 'inversify';
import log4js from 'log4js';
import { VerifyFunction } from 'passport-local';

import { Digest } from '@jamashita/publikum-digest';
import { DataSourceError } from '@jamashita/publikum-error';
import { Noun } from '@jamashita/publikum-interface';
import { Schrodinger, Superposition } from '@jamashita/publikum-monad';

import { Type } from '../Container/Types';
import { NoSuchElementError } from '../Query/Error/NoSuchElementError';
import { IAccountQuery } from '../Query/Interface/IAccountQuery';
import { Account } from '../VO/Account/Account';
import { AccountName } from '../VO/Account/AccountName';
import { AccountError } from '../VO/Account/Error/AccountError';
import { Password } from '../VO/EntranceInformation/Password';

const logger: log4js.Logger = log4js.getLogger();

const DUMMY_PASSWORD: string = '30DC7JzTgjAd8eXcwytlKCwI6kh1eqdU';
const DUMMY_HASH: string = '$2b$14$iyzp4FTxFklmPUjQMaNYcOO4Svv6kBEtphNseTlhWQ/SxV0VBKOa.';

@injectable()
export class AuthenticationInteractor implements Noun {
  public readonly noun: 'AuthenticationInteractor' = 'AuthenticationInteractor';
  public readonly accountQuery: IAccountQuery;

  public constructor(@inject(Type.AccountMySQLQuery) accountQuery: IAccountQuery) {
    this.accountQuery = accountQuery;
  }

  public review(): VerifyFunction {
    return async (name: string, pass: string, callback: (error: unknown, account?: unknown) => void): Promise<void> => {
      const superposition: Superposition<
        Account,
        AccountError | NoSuchElementError | DataSourceError
      > = await Schrodinger.playground<Account, AccountError | NoSuchElementError | DataSourceError>(() => {
        return this.accountQuery.findByAccount(AccountName.of(name));
      });

      superposition.match<void>(
        async (account: Account) => {
          const correct: boolean = await account.verify(Password.of(pass));

          if (correct) {
            callback(null, account.getVeauAccount());

            return;
          }

          callback(null, false);
        },
        async (err: AccountError | NoSuchElementError | DataSourceError) => {
          // time adjustment
          await Digest.compare(DUMMY_PASSWORD, DUMMY_HASH);

          logger.warn(err);
          logger.info(`invalid account: ${name} and password: ${pass}`);
          callback(null, false);
        }
      );
    };
  }
}
