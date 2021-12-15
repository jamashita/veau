import { inject, injectable } from 'inversify';
import { ActionsObservable, ofType } from 'redux-observable';
import { from, merge, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { Type } from '../../container/Types';
import { ISessionCommand } from '../../repository/command/interface/ISessionCommand';
import { LOGOUT, VeauAction } from '../Action';
import { initializeIdentity } from '../ActionCreator/IdentityActionCreator';
import { nothing } from '../ActionCreator/NothingActionCreator';
import { closeProvider } from '../ActionCreator/PageProviderActionCreator';
import { pushToEntrance } from '../ActionCreator/RedirectActionCreator';

@injectable()
export class LogoutEpic {
  private readonly sessionCommand: ISessionCommand;

  public constructor(@inject(Type.SessionFetchCommand) sessionCommand: ISessionCommand) {
    this.sessionCommand = sessionCommand;
  }

  public init(action$: ActionsObservable<VeauAction>): Observable<VeauAction> {
    return merge<Array<VeauAction>>(this.logout(action$));
  }

  public logout(action$: ActionsObservable<VeauAction>): Observable<VeauAction> {
    return action$.pipe<VeauAction, VeauAction>(
      ofType<VeauAction, VeauAction>(LOGOUT),
      mergeMap<VeauAction, Observable<VeauAction>>(() => {
        return from<Promise<Observable<VeauAction>>>(
          this.sessionCommand.delete().transform<Observable<VeauAction>, Error>(() => {
            return of<Array<VeauAction>>(initializeIdentity(), closeProvider(), pushToEntrance());
          }, () => {
            return of<VeauAction>(nothing());
          }).get()
        ).pipe<VeauAction>(
          mergeMap<Observable<VeauAction>, Observable<VeauAction>>((observable: Observable<VeauAction>) => {
            return observable;
          })
        );
      })
    );
  }
}
