import { inject, injectable } from 'inversify';
import { ActionsObservable, ofType } from 'redux-observable';
import { from, merge, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { DataSourceError } from '@jamashita/publikum-error';
import { Superposition } from '@jamashita/publikum-monad';

import { ISessionCommand } from '../../Command/Interface/ISessionCommand';
import { Type } from '../../Container/Types';
import { LOGOUT, LogoutAction, VeauAction } from '../Action/Action';
import { initializeIdentity } from '../Action/IdentityAction';
import { closeProvider } from '../Action/PageProviderAction';
import { pushToEntrance } from '../Action/RedirectAction';

@injectable()
export class LogoutEpic {
  private readonly sessionCommand: ISessionCommand;

  public constructor(@inject(Type.SessionAJAXCommand) sessionCommand: ISessionCommand) {
    this.sessionCommand = sessionCommand;
  }

  public init(action$: ActionsObservable<VeauAction>): Observable<VeauAction> {
    return merge<VeauAction>(this.logout(action$));
  }

  public logout(action$: ActionsObservable<VeauAction>): Observable<VeauAction> {
    return action$.pipe<LogoutAction, VeauAction>(
      ofType<VeauAction, LogoutAction>(LOGOUT),
      mergeMap<VeauAction, Observable<VeauAction>>(() => {
        return from<Promise<Superposition<unknown, DataSourceError>>>(this.sessionCommand.delete()).pipe<VeauAction>(
          mergeMap<unknown, Observable<VeauAction>>(() => {
            return of<VeauAction>(initializeIdentity(), closeProvider(), pushToEntrance());
          })
        );
      })
    );
  }
}
