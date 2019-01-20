import { Express } from 'express';
import { Logger } from 'log4js';
import * as log4js from 'log4js';
import * as passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { VeauAccount, VeauAccountJSON } from '../veau-entity/VeauAccount';
import { VeauAccountFactory } from '../veau-factory/VeauAccountFactory';
import { Digest } from '../veau-general/Digest';
import { NoSuchElementError } from '../veau-general/Error';
import { VeauAccountHash, VeauAccountRepository } from '../veau-repository/VeauAccountRepository';

const logger: Logger = log4js.getLogger();
const veauAccountRepository: VeauAccountRepository = VeauAccountRepository.getInstance();
const veauAccountFactory: VeauAccountFactory = VeauAccountFactory.getInstance();

passport.use(
  new LocalStrategy({
    usernameField: 'account',
    passwordField: 'password',
    session: true
  }, async (account: string, password: string, done: (error: any, account?: any) => void): Promise<void> => {
    try {
      const veauAccountHash: VeauAccountHash = await veauAccountRepository.findByAccount(account);

      if (await Digest.compare(password, veauAccountHash.hash)) {
        done(null, veauAccountHash.veauAccount);
        return;
      }

      done(null, false);
    }
    catch (err) {
      if (err instanceof NoSuchElementError) {
        // time adjustment
        await Digest.compare(password, 'dummy');
        logger.info(`invalid account: ${account} and password: ${password}`);
        done(null, false);
        return;
      }
      logger.error(err.message);
      done(err);
    }
  })
);

passport.serializeUser<VeauAccount, VeauAccountJSON>((account: VeauAccount, done: (err: any, json: VeauAccountJSON) => void) => {
  done(null, account.toJSON());
});

passport.deserializeUser<VeauAccount, VeauAccountJSON>((json: VeauAccountJSON, done: (err: any, account: VeauAccount) => void) => {
  const veauAccount: VeauAccount = veauAccountFactory.fromJSON(json);
  done(null, veauAccount);
});

export const AuthenticationService: (app: Express) => void = (app: Express): void => {
  app.use(passport.initialize());
  app.use(passport.session());
};
