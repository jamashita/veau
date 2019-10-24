import { inject, injectable } from 'inversify';
import log4js from 'log4js';
import { TYPE } from '../veau-container/Types';
import { NoSuchElementError } from '../veau-error/NoSuchElementError';
import { Digest } from '../veau-general/Digest';
import { VeauAccountHash, VeauAccountQuery } from '../veau-query/VeauAccountQuery';

const logger: log4js.Logger = log4js.getLogger();

const DUMMY_PASSWORD: string = '30DC7JzTgjAd8eXcwytlKCwI6kh1eqdU';
const DUMMY_HASH: string = '$2b$14$iyzp4FTxFklmPUjQMaNYcOO4Svv6kBEtphNseTlhWQ/SxV0VBKOa.';

@injectable()
export class AuthenticationInteractor {
  private veauAccountQuery: VeauAccountQuery;

  public constructor(
    @inject(TYPE.VeauAccountQuery) veauAccountQuery: VeauAccountQuery
  ) {
    this.veauAccountQuery = veauAccountQuery;
  }

  public async review(account: string, password: string, callback: (error: unknown, account?: unknown) => void): Promise<void> {
    try {
      const accountHash: VeauAccountHash =  await this.veauAccountQuery.findByAccount(account);

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
        await Digest.compare(DUMMY_PASSWORD, DUMMY_HASH);
        logger.info(`invalid account: ${account} and password: ${password}`);
        callback(null, false);
        return;
      }

      logger.fatal(err.message);
      callback(err);
    }
  }
}
