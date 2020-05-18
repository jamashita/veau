import { inject, injectable } from 'inversify';
import { DataSourceError, Superposition } from 'publikum';
import { ActionsObservable, ofType, StateObservable } from 'redux-observable';
import { concat, from, merge, Observable, of } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import { TYPE } from '../../Container/Types';
import { IdentityError } from '../../Error/IdentityError';
import { VeauAccountError } from '../../Error/VeauAccountError';
import { IIdentityQuery } from '../../Query/Interface/IIdentityQuery';
import { EntranceInformation } from '../../VO/EntranceInformation';
import { Identity } from '../../VO/Identity';
import { VeauAccount } from '../../VO/VeauAccount';
import {
  Action,
  ENTRANCE_ACCOUNT_NAME_TYPED,
  ENTRANCE_PASSWORD_TYPED,
  EntranceAccountNameTypedAction,
  EntrancePasswordTypedAction,
  IDENTITY_AUTHENTICATE
} from '../Action/Action';
import { updateEntranceInformation } from '../Action/EntranceAction';
import { identified, identityAuthenticated } from '../Action/IdentityAction';
import { loaded, loading } from '../Action/LoadingAction';
import { raiseModal } from '../Action/ModalAction';
import { pushToStatsList } from '../Action/RedirectAction';
import { State } from '../State';

@injectable()
export class EntranceEpic {
  private readonly identityQuery: IIdentityQuery;

  public constructor(@inject(TYPE.IdentityVaultQuery) identityQuery: IIdentityQuery) {
    this.identityQuery = identityQuery;
  }

  public init(action$: ActionsObservable<Action>, state$: StateObservable<State>): Observable<Action> {
    return merge<Action, Action, Action>(
      this.login(action$, state$),
      this.accountNameTyped(action$, state$),
      this.passwordTyped(action$, state$)
    );
  }

  public login(action$: ActionsObservable<Action>, state$: StateObservable<State>): Observable<Action> {
    return action$.pipe<Action, Action, Action>(
      ofType<Action, Action>(IDENTITY_AUTHENTICATE),
      filter<Action>(() => {
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
      mergeMap<Action, Observable<Action>>(() => {
        return concat<Action>(
          of<Action>(loading()),
          mergeMap<unknown, Observable<Action>>(() => {
            // prettier-ignore
            const {
              value: {
                entranceInformation
              }
            } = state$;

            return from<Promise<Superposition<Identity, IdentityError | DataSourceError>>>(
              this.identityQuery.findByEntranceInfo(entranceInformation)
            ).pipe<Action>(
              mergeMap<Superposition<Identity, IdentityError | DataSourceError>, Observable<Action>>(
                (superposition: Superposition<Identity, IdentityError | DataSourceError>) => {
                  return concat<Action>(
                    of<Action>(loaded()),
                    mergeMap<Superposition<VeauAccount, VeauAccountError | DataSourceError>, Observable<Action>>(() => {
                      return superposition.match<Observable<Action>>(
                        (identity: Identity) => {
                          return of<Action>(identityAuthenticated(identity), pushToStatsList(), identified());
                        },
                        () => {
                          return of<Action>(raiseModal('AUTHENTICATION_FAILED', 'AUTHENTICATION_FAILED_DESCRIPTION'));
                        }
                      );
                    })
                  );
                }
              )
            );
          })
        );
      })
    );
  }

  public accountNameTyped(action$: ActionsObservable<Action>, state$: StateObservable<State>): Observable<Action> {
    return action$.pipe<EntranceAccountNameTypedAction, Action>(
      ofType<Action, EntranceAccountNameTypedAction>(ENTRANCE_ACCOUNT_NAME_TYPED),
      map<EntranceAccountNameTypedAction, Action>((action: EntranceAccountNameTypedAction) => {
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

  public passwordTyped(action$: ActionsObservable<Action>, state$: StateObservable<State>): Observable<Action> {
    return action$.pipe<EntrancePasswordTypedAction, Action>(
      ofType<Action, EntrancePasswordTypedAction>(ENTRANCE_PASSWORD_TYPED),
      map<EntrancePasswordTypedAction, Action>((action: EntrancePasswordTypedAction) => {
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
