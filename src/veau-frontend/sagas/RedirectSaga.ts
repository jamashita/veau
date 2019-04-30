import { push } from 'connected-react-router';
import { fork, put, take } from 'redux-saga/effects';
import { ACTION, PushToStatsEditAction } from '../actions/Action';
import { Endpoints } from '../Endpoints';

export class RedirectSaga {
  private static instance: RedirectSaga = new RedirectSaga();

  public static getInstance(): RedirectSaga {
    return RedirectSaga.instance;
  }

  private constructor() {
  }

  public *init(): IterableIterator<any> {
    yield fork(this.toStatsList);
    yield fork(this.toStatsEdit);
    yield fork(this.toEntrance);
  }

  private *toStatsList(): IterableIterator<any> {
    while (true) {
      yield take(ACTION.PUSH_TO_STATS_LIST);
      yield put(push(Endpoints.STATS_LIST));
    }
  }

  private *toStatsEdit(): IterableIterator<any> {
    while (true) {
      const action: PushToStatsEditAction = yield take(ACTION.PUSH_TO_STATS_EDIT);
      yield put(push(Endpoints.STATS_EDIT.replace(':id', action.statsID.get().get())));
    }
  }

  private *toEntrance(): IterableIterator<any> {
    while (true) {
      yield take(ACTION.PUSH_TO_ENTRANCE);
      yield put(push(Endpoints.ENTRANCE));
    }
  }
}
