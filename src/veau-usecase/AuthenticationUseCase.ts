import * as log4js from 'log4js';
import { Digest } from '../veau-general/Digest';
import { NoSuchElementError } from '../veau-general/Error/NoSuchElementError';
import { IVeauAccountQuery } from '../veau-query/interfaces/IVeauAccountQuery';
import { VeauAccountMySQLQuery } from '../veau-query/VeauAccountMySQLQuery';
import { IAuthenticationUseCase } from './interfaces/IAuthenticationUseCase';

const logger: log4js.Logger = log4js.getLogger();

export class AuthenticationUseCase implements IAuthenticationUseCase {
  private static instance: AuthenticationUseCase = new AuthenticationUseCase();
  private static veauAccountQuery: IVeauAccountQuery = VeauAccountMySQLQuery.getInstance();
  private static DUMMY_PASSWORD: string = '30DC7JzTgjAd8eXcwytlKCwI6kh1eqdU';
  private static DUMMY_HASH: string = '$2b$14$iyzp4FTxFklmPUjQMaNYcOO4Svv6kBEtphNseTlhWQ/SxV0VBKOa.';

  public static getInstance(): AuthenticationUseCase {
    return AuthenticationUseCase.instance;
  }

  private constructor() {
  }

  public async review(account: string, password: string, done: (error: any, account?: any) => void): Promise<void> {
    try {
      const {
        veauAccount,
        hash
      } = await AuthenticationUseCase.veauAccountQuery.findByAccount(account);

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
        await Digest.compare(AuthenticationUseCase.DUMMY_PASSWORD, AuthenticationUseCase.DUMMY_HASH);
        logger.info(`invalid account: ${account} and password: ${password}`);
        done(null, false);
        return;
      }

      logger.fatal(err.message);
      done(err);
    }
  }
}
