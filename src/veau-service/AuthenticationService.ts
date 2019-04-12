import * as log4js from 'log4js';
import * as passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { VeauAccount, VeauAccountJSON } from '../veau-entity/VeauAccount';
import { VeauAccountFactory } from '../veau-factory/VeauAccountFactory';
import { Digest } from '../veau-general/Digest';
import { NoSuchElementError } from '../veau-general/Error/NoSuchElementError';
import { VeauAccountMySQLQuery } from '../veau-query/VeauAccountMySQLQuery';

const logger: log4js.Logger = log4js.getLogger();

const veauAccountQuery: VeauAccountMySQLQuery = VeauAccountMySQLQuery.getInstance();
const veauAccountFactory: VeauAccountFactory = VeauAccountFactory.getInstance();

const DUMMY_PASSWORD: string = '30DC7JzTgjAd8eXcwytlKCwI6kh1eqdU';
const DUMMY_HASH: string = '$2b$14$iyzp4FTxFklmPUjQMaNYcOO4Svv6kBEtphNseTlhWQ/SxV0VBKOa.';

passport.use(
  new LocalStrategy(
    {
      usernameField: 'account',
      passwordField: 'password',
      session: true
    },
    async (account: string, password: string, done: (error: any, account?: any) => void): Promise<void> => {
      try {
        const {
          veauAccount,
          hash
        } = await veauAccountQuery.findByAccount(account);

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
          await Digest.compare(DUMMY_PASSWORD, DUMMY_HASH);
          logger.info(`invalid account: ${account} and password: ${password}`);
          done(null, false);
          return;
        }

        logger.fatal(err.message);
        done(err);
      }
    }
  )
);

passport.serializeUser<VeauAccount, VeauAccountJSON>((account: VeauAccount, done: (err: any, json: VeauAccountJSON) => void) => {
  done(null, account.toJSON());
});

passport.deserializeUser<VeauAccount, VeauAccountJSON>((json: VeauAccountJSON, done: (err: any, account: VeauAccount) => void) => {
  const veauAccount: VeauAccount = veauAccountFactory.fromJSON(json);
  done(null, veauAccount);
});
