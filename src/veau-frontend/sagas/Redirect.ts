import { push } from 'connected-react-router';
import { fork, put, take } from 'redux-saga/effects';
import { ACTION } from '../../declarations/Action';
import { Endpoints } from '../Endpoints';

export class Redirect {

  public static *init(): IterableIterator<any> {
    yield fork(Redirect.toStatsList);
    yield fork(Redirect.toEntrance);
  }

  private static *toStatsList(): IterableIterator<any> {
    while (true) {
      yield take(ACTION.PUSH_TO_STATS_LIST);
      yield put(push(Endpoints.STATS_LIST));
    }
  }

  private static *toEntrance(): IterableIterator<any> {
    while (true) {
      yield take(ACTION.PUSH_TO_ENTRANCE);
      yield put(push(Endpoints.ENTRANCE));
    }
  }
}
