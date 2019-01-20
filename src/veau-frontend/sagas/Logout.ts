import {call, fork, put, take} from 'redux-saga/effects';
import {ACTION} from '../../declarations/Action';
import {AJAX} from '../../veau-general/AJAX';
import {initializeItentity} from '../actions/IdentityAction';
import {pushToEntrance} from '../actions/RedirectAction';

export class Logout {

  public static *init(): IterableIterator<any> {
    yield fork(Logout.logout);
  }

  private static *logout(): IterableIterator<any> {
    while (true) {
      yield take(ACTION.LOGOUT);

      try {
        yield call(AJAX.get, '/api/destroy');

        yield put(initializeItentity());
        yield put(pushToEntrance());
      }
      catch (err) {
        // NOOP
      }
    }
  }
}
