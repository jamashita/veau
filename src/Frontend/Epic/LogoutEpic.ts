import { inject, injectable } from 'inversify';
import { DataSourceError, Superposition } from 'publikum';
import { ActionsObservable, ofType } from 'redux-observable';
import { from, merge, Observable } from 'rxjs';
import { mapTo, mergeMap } from 'rxjs/operators';

import { ISessionCommand } from '../../Command/Interface/ISessionCommand';
import { TYPE } from '../../Container/Types';
import { Action, LOGOUT, LogoutAction } from '../Action/Action';
import { initializeIdentity } from '../Action/IdentityAction';
import { closeProvider } from '../Action/PageProviderAction';
import { pushToEntrance } from '../Action/RedirectAction';

@injectable()
export class LogoutEpic {
  private readonly sessionCommand: ISessionCommand;

  public constructor(@inject(TYPE.SessionAJAXCommand) sessionCommand: ISessionCommand) {
    this.sessionCommand = sessionCommand;
  }

  public init(action$: ActionsObservable<Action>): Observable<Action> {
    return merge<Action>(this.logout(action$));
  }

  public logout(action$: ActionsObservable<Action>): Observable<Action> {
    return action$.pipe<LogoutAction, Action>(
      ofType<Action, LogoutAction>(LOGOUT),
      mergeMap<Action, Observable<Action>>(() => {
        return from<Promise<Superposition<void, DataSourceError>>>(this.sessionCommand.delete()).pipe<
          Action,
          Action,
          Action
        >(
          mapTo<Superposition<void, DataSourceError>, Action>(initializeIdentity()),
          mapTo<Action, Action>(closeProvider()),
          mapTo<Action, Action>(pushToEntrance())
        );
      })
    );
  }
}
