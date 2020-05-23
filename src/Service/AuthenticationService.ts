import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

import { kernel } from '../Container/Kernel';
import { Type } from '../Container/Types';
import { AuthenticationInteractor } from '../Interactor/AuthenticationInteractor';
import { VeauAccountError } from '../VO/VeauAccount/Error/VeauAccountError';
import { VeauAccount, VeauAccountJSON } from '../VO/VeauAccount/VeauAccount';

const authenticationInteractor: AuthenticationInteractor = kernel.get<AuthenticationInteractor>(
  Type.AuthenticationInteractor
);

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
    VeauAccount.ofJSON(json).match<void>(
      (account: VeauAccount) => {
        done(null, account);
      },
      (err: VeauAccountError) => {
        done(err);
      }
    );
  }
);
