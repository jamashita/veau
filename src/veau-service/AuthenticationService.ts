import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { kernel } from '../veau-container/Container';
import { TYPE } from '../veau-container/Types';
import { VeauAccountError } from '../veau-error/VeauAccountError';
import { AuthenticationInteractor } from '../veau-interactor/AuthenticationInteractor';
import { VeauAccount, VeauAccountJSON } from '../veau-vo/VeauAccount';

const authenticationInteractor: AuthenticationInteractor = kernel.get<AuthenticationInteractor>(TYPE.AuthenticationInteractor);

passport.use(new LocalStrategy(
  {
    usernameField: 'account',
    passwordField: 'password',
    session: true
  },
  authenticationInteractor.review()
));

passport.serializeUser<VeauAccount, VeauAccountJSON>((account: VeauAccount, done: (err: unknown, json: VeauAccountJSON) => void) => {
  done(null, account.toJSON());
});

passport.deserializeUser<VeauAccount, VeauAccountJSON>((json: VeauAccountJSON, done: (err: unknown, account?: VeauAccount) => void) => {
  VeauAccount.ofJSON(json).match<void>((account: VeauAccount) => {
    done(null, account);
  }, (err: VeauAccountError) => {
    done(err);
  });
});
