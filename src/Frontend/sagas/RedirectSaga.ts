import { SagaIterator } from '@redux-saga/types';
import { push } from 'connected-react-router';
import { injectable } from 'inversify';
import { fork, put, take } from 'redux-saga/effects';
import { ACTION, PushToStatsEditAction } from '../Action/Action';
import { Endpoints } from '../Endpoints';

@injectable()
export class RedirectSaga {

  public *init(): IterableIterator<unknown> {
    yield fork(this.toStatsList);
    yield fork(this.toStatsEdit);
    yield fork(this.toEntrance);
  }

  private *toStatsList(): SagaIterator<unknown> {
    while (true) {
      yield take(ACTION.PUSH_TO_STATS_LIST);
      yield put(push(Endpoints.STATS_LIST));
    }
  }

  private *toStatsEdit(): SagaIterator<unknown> {
    while (true) {
      const action: PushToStatsEditAction = yield take(ACTION.PUSH_TO_STATS_EDIT);
      yield put(push(Endpoints.STATS_EDIT.replace(':id', action.statsID.get().get)));
    }
  }

  private *toEntrance(): SagaIterator<unknown> {
    while (true) {
      yield take(ACTION.PUSH_TO_ENTRANCE);
      yield put(push(Endpoints.ENTRANCE));
    }
  }
}
