/* eslint-disable */
// @ts-nocheck
import { push } from 'connected-react-router';
import { SagaIterator } from 'redux-saga';
import { fork, put, take } from 'redux-saga/effects';

import { PUSH_TO_ENTRANCE, PUSH_TO_STATS_EDIT, PUSH_TO_STATS_LIST, PushToStatsEditAction } from '../Action';
import { Endpoints } from '../Endpoints';

export class RedirectSaga {
  public *init(): IterableIterator<unknown> {
    yield fork(this.toStatsList);
    yield fork(this.toStatsEdit);
    yield fork(this.toEntrance);
  }

  private *toStatsList(): SagaIterator<unknown> {
    while (true) {
      yield take(PUSH_TO_STATS_LIST);
      yield put(push(Endpoints.STATS_LIST));
    }
  }

  private *toStatsEdit(): SagaIterator<unknown> {
    while (true) {
      const action: PushToStatsEditAction = yield take(PUSH_TO_STATS_EDIT);

      yield put(push(Endpoints.STATS_EDIT.replace(':id', action.statsID.get().get)));
    }
  }

  private *toEntrance(): SagaIterator<unknown> {
    while (true) {
      yield take(PUSH_TO_ENTRANCE);
      yield put(push(Endpoints.ENTRANCE));
    }
  }
}
