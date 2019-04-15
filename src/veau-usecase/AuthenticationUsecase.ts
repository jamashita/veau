import * as log4js from 'log4js';
import { Digest } from '../veau-general/Digest';
import { NoSuchElementError } from '../veau-general/Error/NoSuchElementError';
import { IVeauAccountQuery } from '../veau-query/interfaces/IVeauAccountQuery';
import { VeauAccountMySQLQuery } from '../veau-query/VeauAccountMySQLQuery';
import { IAuthenticationUsecase } from './interfaces/IAuthenticationUsecase';

const logger: log4js.Logger = log4js.getLogger();

export class AuthenticationUsecase implements IAuthenticationUsecase {
  private static instance: AuthenticationUsecase = new AuthenticationUsecase();
  private static veauAccountQuery: IVeauAccountQuery = VeauAccountMySQLQuery.getInstance();
  private static DUMMY_PASSWORD: string = '30DC7JzTgjAd8eXcwytlKCwI6kh1eqdU';
  private static DUMMY_HASH: string = '$2b$14$iyzp4FTxFklmPUjQMaNYcOO4Svv6kBEtphNseTlhWQ/SxV0VBKOa.';

  public static getInstance(): AuthenticationUsecase {
    return AuthenticationUsecase.instance;
  }

  private constructor() {
  }

  public async review(account: string, password: string, done: (error: any, account?: any) => void): Promise<void> {
    try {
      const {
        veauAccount,
        hash
      } = await AuthenticationUsecase.veauAccountQuery.findByAccount(account);

      const correct: boolean = await Digest.compare(password, hash);

      if (correct) {
        done(null, veauAccount);
        return;
      }

      done(null, false);
    }
    catch (err) {
      if (err instanceof NoSuchElementError) {
        // time adjustment
        await Digest.compare(AuthenticationUsecase.DUMMY_PASSWORD, AuthenticationUsecase.DUMMY_HASH);
        logger.info(`invalid account: ${account} and password: ${password}`);
        done(null, false);
        return;
      }

      logger.fatal(err.message);
      done(err);
    }
  }
}
