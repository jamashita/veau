import { inject, injectable } from 'inversify';
import { ActionsObservable, ofType, StateObservable } from 'redux-observable';
import { concat, merge, Observable, of } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';

import { Type } from '../../Container/Types';
import { IIdentityQuery } from '../../Query/Interface/IIdentityQuery';
import { EntranceInformation } from '../../VO/EntranceInformation/EntranceInformation';
import { Identity } from '../../VO/Identity/Identity';
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

  public init(action$: ActionsObservable<VeauAction>, state$: StateObservable<State>): Observable<VeauAction> {
    return merge<VeauAction>(
      this.login(action$, state$),
      this.accountNameTyped(action$, state$),
      this.passwordTyped(action$, state$)
    );
  }

  public login(action$: ActionsObservable<VeauAction>, state$: StateObservable<State>): Observable<VeauAction> {
    return action$.pipe<VeauAction, VeauAction, VeauAction>(
      ofType<VeauAction, VeauAction>(IDENTITY_AUTHENTICATE),
      filter<VeauAction>(() => {
        // prettier-ignore
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
        // prettier-ignore
        const {
          value: {
            entranceInformation
          }
        } = state$;

        return concat<VeauAction>(
          of<VeauAction>(loading()),
          this.identityQuery.findByEntranceInfo(entranceInformation).transform<Observable<VeauAction>, Error>(
            (identity: Identity) => {
              return of<VeauAction>(identityAuthenticated(identity), pushToStatsList(), identified());
            },
            () => {
              return of<VeauAction>(raiseModal('AUTHENTICATION_FAILED', 'AUTHENTICATION_FAILED_DESCRIPTION'));
            }
          ).get(),
          of<VeauAction>(loaded())
        );
      })
    );
  }

  public accountNameTyped(
    action$: ActionsObservable<VeauAction>,
    state$: StateObservable<State>
  ): Observable<VeauAction> {
    return action$.pipe<EntranceAccountNameTypedAction, VeauAction>(
      ofType<VeauAction, EntranceAccountNameTypedAction>(ENTRANCE_ACCOUNT_NAME_TYPED),
      map<EntranceAccountNameTypedAction, VeauAction>((action: EntranceAccountNameTypedAction) => {
        // prettier-ignore
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

  public passwordTyped(action$: ActionsObservable<VeauAction>, state$: StateObservable<State>): Observable<VeauAction> {
    return action$.pipe<EntrancePasswordTypedAction, VeauAction>(
      ofType<VeauAction, EntrancePasswordTypedAction>(ENTRANCE_PASSWORD_TYPED),
      map<EntrancePasswordTypedAction, VeauAction>((action: EntrancePasswordTypedAction) => {
        // prettier-ignore
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
