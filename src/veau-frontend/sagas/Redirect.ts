import { push } from 'connected-react-router';
import { fork, put, take } from 'redux-saga/effects';
import { ACTION, PushToStatsEditAction } from '../../declarations/Action';
import { StatsID } from '../../veau-vo/StatsID';
import { Endpoints } from '../Endpoints';

export class Redirect {

  public static *init(): IterableIterator<any> {
    yield fork(Redirect.toStatsList);
    yield fork(Redirect.toStatsEdit);
    yield fork(Redirect.toEntrance);
  }

  private static *toStatsList(): IterableIterator<any> {
    while (true) {
      yield take(ACTION.PUSH_TO_STATS_LIST);
      yield put(push(Endpoints.STATS_LIST));
    }
  }

  private static *toStatsEdit(): IterableIterator<any> {
    while (true) {
      const action: PushToStatsEditAction = yield take(ACTION.PUSH_TO_STATS_EDIT);
      const statsID: StatsID = action.statsID;

      yield put(push(Endpoints.STATS_EDIT.replace(':id', statsID.get().get())));
    }
  }

  private static *toEntrance(): IterableIterator<any> {
    while (true) {
      yield take(ACTION.PUSH_TO_ENTRANCE);
      yield put(push(Endpoints.ENTRANCE));
    }
  }
}
