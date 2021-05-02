import { inject, injectable } from 'inversify';
import { ActionsObservable, ofType, StateObservable } from 'redux-observable';
import { concat, from, merge, Observable, of } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import { Type } from '../../container/Types';
import { EntranceInformation } from '../../domain/vo/EntranceInformation/EntranceInformation';
import { Identity } from '../../domain/vo/Identity/Identity';
import { IIdentityQuery } from '../../repository/query/Interface/IIdentityQuery';
import {
  ENTRANCE_ACCOUNT_NAME_TYPED,
  ENTRANCE_PASSWORD_TYPED,
  EntranceAccountNameTypedAction,
  EntrancePasswordTypedAction,
  IDENTITY_AUTHENTICATE,
  VeauAction
} from '../Action';
import { updateEntranceInformation } from '../ActionCreator/EntranceActionCreator';
import { identified, identityAuthenticated } from '../ActionCreator/IdentityActionCreator';
import { loaded, loading } from '../ActionCreator/LoadingActionCreator';
import { raiseModal } from '../ActionCreator/ModalActionCreator';
import { pushToStatsList } from '../ActionCreator/RedirectActionCreator';
import { State } from '../State';

@injectable()
export class EntranceEpic {
  private readonly identityQuery: IIdentityQuery;

  public constructor(@inject(Type.IdentityVaultQuery) identityQuery: IIdentityQuery) {
    this.identityQuery = identityQuery;
  }

  public accountNameTyped(action$: ActionsObservable<VeauAction>, state$: StateObservable<State>): Observable<VeauAction> {
    return action$.pipe<EntranceAccountNameTypedAction, VeauAction>(
      ofType<VeauAction, EntranceAccountNameTypedAction>(ENTRANCE_ACCOUNT_NAME_TYPED),
      map<EntranceAccountNameTypedAction, VeauAction>((action: EntranceAccountNameTypedAction) => {
        const {
          value: {
            entranceInformation
          }
        } = state$;

        const newInfo: EntranceInformation = EntranceInformation.of(action.account, entranceInformation.getPassword());

        return updateEntranceInformation(newInfo);
      })
    );
  }

  public init(action$: ActionsObservable<VeauAction>, state$: StateObservable<State>): Observable<VeauAction> {
    return merge<Array<VeauAction>>(
      this.login(action$, state$),
      this.accountNameTyped(action$, state$),
      this.passwordTyped(action$, state$)
    );
  }

  public login(action$: ActionsObservable<VeauAction>, state$: StateObservable<State>): Observable<VeauAction> {
    return action$.pipe<VeauAction, VeauAction, VeauAction>(
      ofType<VeauAction, VeauAction>(IDENTITY_AUTHENTICATE),
      filter<VeauAction>(() => {
        const {
          value: {
            modal: {
              open
            },
            entranceInformation
          }
        } = state$;

        if (open) {
          return false;
        }

        return entranceInformation.isAcceptable();
      }),
      mergeMap<VeauAction, Observable<VeauAction>>(() => {
        const {
          value: {
            entranceInformation
          }
        } = state$;

        return concat<Array<VeauAction>>(
          of<VeauAction>(loading()),
          from<Promise<Observable<VeauAction>>>(
            this.identityQuery.findByEntranceInfo(entranceInformation).transform<Observable<VeauAction>, Error>((identity: Identity) => {
              return of<Array<VeauAction>>(identityAuthenticated(identity), pushToStatsList(), identified());
            }, () => {
              return of<VeauAction>(raiseModal('AUTHENTICATION_FAILED', 'AUTHENTICATION_FAILED_DESCRIPTION'));
            }).get()
          ).pipe<VeauAction>(
            mergeMap<Observable<VeauAction>, Observable<VeauAction>>((observable: Observable<VeauAction>) => {
              return observable;
            })
          ),
          of<VeauAction>(loaded())
        );
      })
    );
  }

  public passwordTyped(action$: ActionsObservable<VeauAction>, state$: StateObservable<State>): Observable<VeauAction> {
    return action$.pipe<EntrancePasswordTypedAction, VeauAction>(
      ofType<VeauAction, EntrancePasswordTypedAction>(ENTRANCE_PASSWORD_TYPED),
      map<EntrancePasswordTypedAction, VeauAction>((action: EntrancePasswordTypedAction) => {
        const {
          value: {
            entranceInformation
          }
        } = state$;

        const newInfo: EntranceInformation = EntranceInformation.of(entranceInformation.getAccount(), action.password);

        return updateEntranceInformation(newInfo);
      })
    );
  }
}
