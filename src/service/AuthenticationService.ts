import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { kernel } from '../container/Kernel';
import { Type } from '../container/Types';
import { VeauAccount, VeauAccountJSON } from '../domain/vo/VeauAccount/VeauAccount';
import { AuthenticationInteractor } from '../interactor/AuthenticationInteractor';

const authenticationInteractor: AuthenticationInteractor = kernel.get<AuthenticationInteractor>(Type.AuthenticationInteractor);

passport.use(
  new LocalStrategy(
    {
      usernameField: 'account',
      passwordField: 'password',
      session: true
    },
    authenticationInteractor.review()
  )
);

passport.serializeUser<VeauAccount, VeauAccountJSON>(
  (account: VeauAccount, done: (err: unknown, json: VeauAccountJSON) => void) => {
    done(null, account.toJSON());
  }
);

passport.deserializeUser<VeauAccount, VeauAccountJSON>(
  (json: VeauAccountJSON, done: (err: unknown, account?: VeauAccount) => void) => {
    try {
      done(null, VeauAccount.ofJSON(json));
    }
    catch (err: unknown) {
      done(err);
    }
  }
);
