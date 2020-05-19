import { inject, injectable } from 'inversify';
import { DataSourceError, Superposition } from 'publikum';
import { ActionsObservable, ofType } from 'redux-observable';
import { from, merge, Observable } from 'rxjs';
import { mapTo, mergeMap } from 'rxjs/operators';

import { ISessionCommand } from '../../Command/Interface/ISessionCommand';
import { Type } from '../../Container/Types';
import { Action, LOGOUT, LogoutAction } from '../Action/Action';
import { initializeIdentity } from '../Action/IdentityAction';
import { closeProvider } from '../Action/PageProviderAction';
import { pushToEntrance } from '../Action/RedirectAction';

@injectable()
export class LogoutEpic {
  private readonly sessionCommand: ISessionCommand;

  public constructor(@inject(Type.SessionAJAXCommand) sessionCommand: ISessionCommand) {
    this.sessionCommand = sessionCommand;
  }

  public init(action$: ActionsObservable<Action>): Observable<Action> {
    return merge<Action>(this.logout(action$));
  }

  public logout(action$: ActionsObservable<Action>): Observable<Action> {
    return action$.pipe<LogoutAction, Action>(
      ofType<Action, LogoutAction>(LOGOUT),
      mergeMap<Action, Observable<Action>>(() => {
        // TODO of ?
        return from<Promise<Superposition<unknown, DataSourceError>>>(this.sessionCommand.delete()).pipe<
          Action,
          Action,
          Action
        >(
          mapTo<Superposition<unknown, DataSourceError>, Action>(initializeIdentity()),
          mapTo<Action, Action>(closeProvider()),
          mapTo<Action, Action>(pushToEntrance())
        );
      })
    );
  }
}
