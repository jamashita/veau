import { push } from 'connected-react-router';
import { injectable } from 'inversify';
import { ActionsObservable, ofType } from 'redux-observable';
import { merge, Observable } from 'rxjs';
import { map, mapTo } from 'rxjs/operators';

import { PUSH_TO_ENTRANCE, PUSH_TO_STATS_EDIT, PUSH_TO_STATS_LIST, PushToStatsEditAction, VeauAction } from '../Action';
import { Endpoints } from '../Endpoints';

@injectable()
export class RedirectEpic {
  public init(action$: ActionsObservable<VeauAction>): Observable<VeauAction> {
    return merge<VeauAction>(this.toStatsList(action$), this.toStatsEdit(action$), this.toEntrance(action$));
  }

  public toStatsList(action$: ActionsObservable<VeauAction>): Observable<VeauAction> {
    return action$.pipe<VeauAction, VeauAction>(
      ofType<VeauAction, VeauAction>(PUSH_TO_STATS_LIST),
      mapTo<VeauAction, VeauAction>(push(Endpoints.STATS_LIST))
    );
  }

  public toStatsEdit(action$: ActionsObservable<VeauAction>): Observable<VeauAction> {
    return action$.pipe<PushToStatsEditAction, VeauAction>(
      ofType<VeauAction, PushToStatsEditAction>(PUSH_TO_STATS_EDIT),
      map<PushToStatsEditAction, VeauAction>((action: PushToStatsEditAction) => {
        return push(Endpoints.STATS_EDIT.replace(':id', action.statsID.get().get()));
      })
    );
  }

  public toEntrance(action$: ActionsObservable<VeauAction>): Observable<VeauAction> {
    return action$.pipe<VeauAction, VeauAction>(
      ofType<VeauAction, VeauAction>(PUSH_TO_ENTRANCE),
      mapTo<VeauAction, VeauAction>(push(Endpoints.ENTRANCE))
    );
  }
}
