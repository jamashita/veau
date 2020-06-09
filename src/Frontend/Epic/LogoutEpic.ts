import { inject, injectable } from 'inversify';
import { ActionsObservable, ofType } from 'redux-observable';
import { from, merge, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { Superposition } from '@jamashita/publikum-monad';

import { ISessionCommand } from '../../Command/Interface/ISessionCommand';
import { Type } from '../../Container/Types';
import { LOGOUT, LogoutAction, VeauAction } from '../Action';
import { initializeIdentity } from '../ActionCreator/IdentityActionCreator';
import { closeProvider } from '../ActionCreator/PageProviderActionCreator';
import { pushToEntrance } from '../ActionCreator/RedirectActionCreator';

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
        return from<Promise<Superposition<unknown, Error>>>(this.sessionCommand.delete()).pipe<VeauAction>(
          mergeMap<unknown, Observable<VeauAction>>(() => {
            return of<VeauAction>(initializeIdentity(), closeProvider(), pushToEntrance());
          })
        );
      })
    );
  }
}
