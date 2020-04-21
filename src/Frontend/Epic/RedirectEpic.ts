import { push } from 'connected-react-router';
import { injectable } from 'inversify';
import { ofType } from 'redux-observable';
import { merge, Observable } from 'rxjs';
import { map, mapTo } from 'rxjs/operators';
import { ACTION, Action, PushToStatsEditAction } from '../Action/Action';
import { Endpoints } from '../Endpoints';

@injectable()
export class RedirectEpic {

  public init(action$: Observable<Action>): Observable<Action> {
    return merge<Action, Action, Action>(
      this.toStatsList(action$),
      this.toStatsEdit(action$),
      this.toEntrance(action$)
    );
  }

  public toStatsList(action$: Observable<Action>): Observable<Action> {
    return action$.pipe<Action, Action>(
      ofType<Action, Action>(ACTION.PUSH_TO_STATS_LIST),
      mapTo<Action, Action>(push(Endpoints.STATS_LIST))
    );
  }

  public toStatsEdit(action$: Observable<Action>): Observable<Action> {
    return action$.pipe<PushToStatsEditAction, Action>(
      ofType<Action, PushToStatsEditAction>(ACTION.PUSH_TO_STATS_EDIT),
      map<PushToStatsEditAction, Action>((action: PushToStatsEditAction) => {

        return push(
          Endpoints.STATS_EDIT.replace(':id', action.statsID.get().get())
        );
      })
    );
  }

  public toEntrance(action$: Observable<Action>): Observable<Action> {
    return action$.pipe<Action, Action>(
      ofType<Action, Action>(ACTION.PUSH_TO_ENTRANCE),
      mapTo<Action, Action>(push(Endpoints.ENTRANCE))
    );
  }
}
