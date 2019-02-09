import { call, fork, put, take } from 'redux-saga/effects';
import { ACTION } from '../actions/Action';
import { AJAX } from '../../veau-general/AJAX';
import { initializeIdentity } from '../actions/IdentityAction';
import { closeProvider } from '../actions/PageProviderAction';
import { pushToEntrance } from '../actions/RedirectAction';

export class Logout {

  public static *init(): IterableIterator<any> {
    yield fork(Logout.logout);
  }

  private static *logout(): IterableIterator<any> {
    while (true) {
      yield take(ACTION.LOGOUT);

      try {
        yield call(AJAX.get, '/api/destroy');

        yield put(initializeIdentity());
        yield put(closeProvider());
        yield put(pushToEntrance());
      }
      catch (err) {
        // NOOP
      }
    }
  }
}
