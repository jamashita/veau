import { inject, injectable } from 'inversify';
import { ofType, StateObservable } from 'redux-observable';
import { from, merge, Observable } from 'rxjs';
import { mapTo, mergeMap } from 'rxjs/operators';
import { ISessionCommand } from '../../Command/Interface/ISessionCommand';
import { TYPE } from '../../Container/Types';
import { DataSourceError } from '../../General/DataSourceError';
import { Superposition } from '../../General/Superposition/Superposition';
import { ACTION, Action, LogoutAction } from '../Action/Action';
import { initializeIdentity } from '../Action/IdentityAction';
import { closeProvider } from '../Action/PageProviderAction';
import { pushToEntrance } from '../Action/RedirectAction';

@injectable()
export class LogoutEpic {
  private readonly sessionCommand: ISessionCommand;

  public constructor(@inject(TYPE.SessionAJAXCommand) sessionCommand: ISessionCommand) {
    this.sessionCommand = sessionCommand;
  }

  public init(action$: Observable<Action>, state$: StateObservable<Action>): Observable<Action> {
    return merge<Action>(
      this.logout(action$, state$)
    );
  }

  public logout(action$: Observable<Action>, state$: StateObservable<Action>): Observable<Action> {

    return action$.pipe<LogoutAction, Action>(
      ofType<Action, LogoutAction>(ACTION.LOGOUT),
      mergeMap<Action, Observable<Action>>(() => {
        return from<Promise<Superposition<void, DataSourceError>>>(this.sessionCommand.delete()).pipe(
          mapTo<Superposition<void, DataSourceError>, Action>(initializeIdentity()),
          mapTo<Action, Action>(closeProvider()),
          mapTo<Action, Action>(pushToEntrance())
        );
      })
    );
  }
}
