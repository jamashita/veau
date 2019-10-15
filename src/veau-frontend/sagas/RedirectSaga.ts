import { SagaIterator } from '@redux-saga/types';
import { push } from 'connected-react-router';
import { fork, put, take } from 'redux-saga/effects';
import { ACTION, PushToStatsEditAction } from '../actions/Action';
import { Endpoints } from '../Endpoints';

export class RedirectSaga {

  public static *init(): IterableIterator<unknown> {
    yield fork(RedirectSaga.toStatsList);
    yield fork(RedirectSaga.toStatsEdit);
    yield fork(RedirectSaga.toEntrance);
  }

  private static *toStatsList(): SagaIterator<unknown> {
    while (true) {
      yield take(ACTION.PUSH_TO_STATS_LIST);
      yield put(push(Endpoints.STATS_LIST));
    }
  }

  private static *toStatsEdit(): SagaIterator<unknown> {
    while (true) {
      const action: PushToStatsEditAction = yield take(ACTION.PUSH_TO_STATS_EDIT);
      yield put(push(Endpoints.STATS_EDIT.replace(':id', action.statsID.get())));
    }
  }

  private static *toEntrance(): SagaIterator<unknown> {
    while (true) {
      yield take(ACTION.PUSH_TO_ENTRANCE);
      yield put(push(Endpoints.ENTRANCE));
    }
  }

  private constructor() {
  }
}
