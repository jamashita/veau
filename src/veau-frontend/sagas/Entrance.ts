import { call, fork, put, select, take } from 'redux-saga/effects';
import * as request from 'superagent';
import { ACTION, EntranceAccountNameTypedAction, EntrancePasswordTypedAction } from '../../declarations/Action';
import { State } from '../../declarations/State';
import { AJAX } from '../../veau-general/AJAX';
import { Identity, IdentityJSON } from '../../veau-vo/Identity';
import { IdentityID } from '../../veau-vo/IdentityID';
import { Login } from '../../veau-vo/Login';
import { entranceLoginInfoUpdate } from '../actions/EntranceAction';
import { identityRenewed } from '../actions/IdentityAction';
import { loaded, loading } from '../actions/LoadingAction';
import { pushToHome } from '../actions/RedirectAction';

const UNAUTHORIZED: number = 401;

export class Entrance {

  public static *init(): IterableIterator<any> {
    yield fork(Entrance.login);
    yield fork(Entrance.accountNameTyped);
    yield fork(Entrance.passwordTyped);
  }

  private static *login(): IterableIterator<any> {
    while (true) {
      yield take(ACTION.IDENTITY_AUTHENTICATE);
      const state: State = yield select();

      const {
        modal: {
          open
        },
        entrance: {
          login
        }
      } = state;

      if (open) {
        continue;
      }
      if (!login.isAcceptable()) {
        continue;
      }

      yield put(loading());
      try {
        const res: request.Response = yield call(AJAX.post, '/api/auth', login.toJSON());
        const json: IdentityJSON = res.body;
        const identiy: Identity = Identity.of(IdentityID.of(json.id), json.account, json.language, json.locale);

        yield put(identityRenewed(identiy));
        yield put(pushToHome());
        yield put(loaded());
      }
      catch (err) {
        yield put(loaded());
        if (err.status === UNAUTHORIZED) {
          // TODO authentication failed
          continue;
        }

        // TODO connection error
      }
    }
  }

  private static *accountNameTyped(): IterableIterator<any> {
    while (true) {
      const action: EntranceAccountNameTypedAction = yield take(ACTION.ENTRANCE_ACCOUNT_NAME_TYPED);
      const state: State = yield select();

      const {
        entrance: {
          login
        }
      } = state;

      const newLogin: Login = Login.of(action.account, login.getPassword());
      yield put(entranceLoginInfoUpdate(newLogin));
    }
  }

  private static *passwordTyped(): IterableIterator<any> {
    while (true) {
      const action: EntrancePasswordTypedAction = yield take(ACTION.ENTRANCE_PASSWORD_TYPED);
      const state: State = yield select();

      const {
        entrance: {
          login
        }
      } = state;

      const newLogin: Login = Login.of(login.getAccount(), action.password);
      yield put(entranceLoginInfoUpdate(newLogin));
    }
  }
}
