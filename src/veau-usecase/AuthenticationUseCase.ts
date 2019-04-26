import * as log4js from 'log4js';
import { Digest } from '../veau-general/Digest';
import { NoSuchElementError } from '../veau-general/Error/NoSuchElementError';
import { IVeauAccountQuery, VeauAccountHash } from '../veau-query/interfaces/IVeauAccountQuery';
import { VeauAccountMySQLQuery } from '../veau-query/VeauAccountMySQLQuery';

const logger: log4js.Logger = log4js.getLogger();

export class AuthenticationUseCase {
  private static instance: AuthenticationUseCase = new AuthenticationUseCase();
  private static veauAccountQuery: IVeauAccountQuery = VeauAccountMySQLQuery.getInstance();

  private static DUMMY_PASSWORD: string = '30DC7JzTgjAd8eXcwytlKCwI6kh1eqdU';
  private static DUMMY_HASH: string = '$2b$14$iyzp4FTxFklmPUjQMaNYcOO4Svv6kBEtphNseTlhWQ/SxV0VBKOa.';

  public static getInstance(): AuthenticationUseCase {
    return AuthenticationUseCase.instance;
  }

  private constructor() {
  }

  public async review(account: string, password: string, callback: (error: any, account?: any) => void): Promise<void> {
    try {
      const accountHash: VeauAccountHash =  await AuthenticationUseCase.veauAccountQuery.findByAccount(account);

      const {
        veauAccount,
        hash
      } = accountHash;

      const correct: boolean = await Digest.compare(password, hash);

      if (correct) {
        callback(null, veauAccount);
        return;
      }

      callback(null, false);
    }
    catch (err) {
      if (err instanceof NoSuchElementError) {
        // time adjustment
        await Digest.compare(AuthenticationUseCase.DUMMY_PASSWORD, AuthenticationUseCase.DUMMY_HASH);
        logger.info(`invalid account: ${account} and password: ${password}`);
        callback(null, false);
        return;
      }

      logger.fatal(err.message);
      callback(err);
    }
  }
}
