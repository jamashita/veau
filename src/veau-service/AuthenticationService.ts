import * as passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { VeauAccount, VeauAccountJSON } from '../veau-entity/VeauAccount';
import { VeauAccountFactory } from '../veau-factory/VeauAccountFactory';
import { AuthenticationInteractor } from '../veau-interactor/AuthenticationInteractor';

const authenticationInteractor: AuthenticationInteractor = AuthenticationInteractor.getInstance();
const veauAccountFactory: VeauAccountFactory = VeauAccountFactory.getInstance();

passport.use(new LocalStrategy(
  {
    usernameField: 'account',
    passwordField: 'password',
    session: true
  },
  authenticationInteractor.review
));

passport.serializeUser<VeauAccount, VeauAccountJSON>((account: VeauAccount, done: (err: any, json: VeauAccountJSON) => void): void => {
  done(null, account.toJSON());
});

passport.deserializeUser<VeauAccount, VeauAccountJSON>((json: VeauAccountJSON, done: (err: any, account: VeauAccount) => void): void => {
  const veauAccount: VeauAccount = veauAccountFactory.fromJSON(json);
  done(null, veauAccount);
});
