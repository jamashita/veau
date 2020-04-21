import { push } from 'connected-react-router';
import { injectable } from 'inversify';
import { ofType, StateObservable } from 'redux-observable';
import { merge, Observable } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { ACTION, Action, CallHistoryAction } from '../Action/Action';
import { Endpoints } from '../Endpoints';
import { State } from '../State';

@injectable()
export class RedirectEpic {

  public init(action$: Observable<Action>, state$: StateObservable<State>): Observable<Action> {
    return merge(
      this.toStatsList(action$, state$)
    );
  }

  public toStatsList(action$: Observable<Action>, state$: StateObservable<State>): Observable<Action> {
    return action$.pipe(
      ofType<Action, Action>(ACTION.PUSH_TO_STATS_LIST),
      mapTo<Action, CallHistoryAction>(push(Endpoints.STATS_LIST))
    );
  }
}
