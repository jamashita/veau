import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { container } from '../veau-container/Container';
import { TYPE } from '../veau-container/Types';
import { AuthenticationInteractor } from '../veau-interactor/AuthenticationInteractor';
import { VeauAccount, VeauAccountJSON } from '../veau-vo/VeauAccount';

const authenticationInteractor: AuthenticationInteractor = container.get<AuthenticationInteractor>(TYPE.AuthenticationInteractor);

passport.use(new LocalStrategy(
  {
    usernameField: 'account',
    passwordField: 'password',
    session: true
  },
  authenticationInteractor.review()
));

passport.serializeUser<VeauAccount, VeauAccountJSON>((account: VeauAccount, done: (err: unknown, json: VeauAccountJSON) => void): void => {
  done(null, account.toJSON());
});

passport.deserializeUser<VeauAccount, VeauAccountJSON>((json: VeauAccountJSON, done: (err: unknown, account: VeauAccount) => void): void => {
  done(null, VeauAccount.ofJSON(json));
});
