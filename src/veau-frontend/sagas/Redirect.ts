import { push } from 'connected-react-router';
import { fork, put, select, take } from 'redux-saga/effects';
import { ACTION, LocationChangeAction } from '../../declarations/Action';
import { State } from '../../declarations/State';
import { Endpoints } from '../Endpoints';

export class Redirect {

  public static *init(): IterableIterator<any> {
    yield fork(Redirect.authenticated);
    yield fork(Redirect.notAuthenticated);
    yield fork(Redirect.toHome);
    yield fork(Redirect.toEntrance);
  }

  private static *authenticated(): IterableIterator<any> {
    while (true) {
      const action: LocationChangeAction = yield take(ACTION.LOCATION_CHANGE);
      const path: string = action.payload.location.pathname;

      if (path === '/') {
        const state: State = yield select();

        const {
          identity
        } = state;

        if (identity.account !== '') {
          yield put(push(Endpoints.HOME));
          continue;
        }
      }
    }
  }

  private static *notAuthenticated(): IterableIterator<any> {
    while (true) {
      const action: LocationChangeAction = yield take(ACTION.LOCATION_CHANGE);
      const path: string = action.payload.location.pathname;

      if (path !== '/') {
        const state: State = yield select();

        const {
          identity
        } = state;

        if (identity.account === '') {
          yield put(push(Endpoints.ENTRANCE));
          continue;
        }
      }
    }
  }

  private static *toHome(): IterableIterator<any> {
    while (true) {
      yield take(ACTION.PUSH_TO_HOME);
      yield put(push(Endpoints.HOME));
    }
  }

  private static *toEntrance(): IterableIterator<any> {
    while (true) {
      yield take(ACTION.PUSH_TO_ENTRANCE);
      yield put(push(Endpoints.ENTRANCE));
    }
  }
}
