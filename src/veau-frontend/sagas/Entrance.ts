import {call, fork, put, select, take} from 'redux-saga/effects';
import * as request from 'superagent';
import {ACTION, EntranceAccountNameTypedAction, EntrancePasswordTypedAction} from '../../declarations/Action';
import {State} from '../../declarations/State';
import {Login} from '../../veau-vo/Login';
import {entranceLoginInfoUpdate} from '../actions/EntranceAction';
import {loaded, loading} from '../actions/LoadingAction';
import {AJAX} from '../../veau-general/AJAX';
import {identified} from '../actions/IdentityAction';
import {pushToHome} from '../actions/RedirectAction';

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

        yield put(identified(res.body));
        yield put(pushToHome());
        yield put(loaded());
      }
      catch(err) {
        yield put(loaded());
        if (err.status === 401) {
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

      const newLogin = Login.of(action.name, login.getPassword())
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

      const newLogin = Login.of(login.getName(), action.password);
      yield put(entranceLoginInfoUpdate(newLogin));
    }
  }
}
