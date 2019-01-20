import { push } from 'connected-react-router';
import { fork, put, take } from 'redux-saga/effects';
import { ACTION } from '../../declarations/Action';
import { Endpoints } from '../Endpoints';

export class Redirect {

  public static *init(): IterableIterator<any> {
    yield fork(Redirect.toHome);
    yield fork(Redirect.toEntrance);
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
