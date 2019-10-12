import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { AuthenticationInteractor } from '../veau-interactor/AuthenticationInteractor';
import { VeauAccount, VeauAccountJSON } from '../veau-vo/VeauAccount';

const authenticationInteractor: AuthenticationInteractor = AuthenticationInteractor.getInstance();

passport.use(new LocalStrategy(
  {
    usernameField: 'account',
    passwordField: 'password',
    session: true
  },
  authenticationInteractor.review
));

passport.serializeUser<VeauAccount, VeauAccountJSON>((account: VeauAccount, done: (err: unknown, json: VeauAccountJSON) => void): void => {
  done(null, account.toJSON());
});

passport.deserializeUser<VeauAccount, VeauAccountJSON>((json: VeauAccountJSON, done: (err: unknown, account: VeauAccount) => void): void => {
  done(null, VeauAccount.ofJSON(json));
});
