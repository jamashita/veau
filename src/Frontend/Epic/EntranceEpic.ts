import { inject, injectable } from 'inversify';
import { ActionsObservable, ofType, StateObservable } from 'redux-observable';
import { concat, EMPTY, merge, Observable, of } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import { TYPE } from '../../Container/Types';
import { ISessionQuery } from '../../Query/Interface/ISessionQuery';
import { EntranceInformation } from '../../VO/EntranceInformation';
import {
  Action,
  ENTRANCE_ACCOUNT_NAME_TYPED,
  ENTRANCE_PASSWORD_TYPED,
  EntranceAccountNameTypedAction,
  EntrancePasswordTypedAction,
  IDENTITY_AUTHENTICATE
} from '../Action/Action';
import { updateEntranceInformation } from '../Action/EntranceAction';
import { loaded, loading } from '../Action/LoadingAction';
import { State } from '../State';

@injectable()
export class EntranceEpic {
  private readonly sessionQuery: ISessionQuery;

  public constructor(@inject(TYPE.SessionAJAXQuery) sessionQuery: ISessionQuery) {
    this.sessionQuery = sessionQuery;
  }

  public init(action$: ActionsObservable<Action>, state$: StateObservable<State>): Observable<Action> {
    return merge<Action, Action, Action>(
      this.login(action$, state$),
      this.accountNameTyped(action$, state$),
      this.passwordTyped(action$, state$)
    );
  }

  public login(action$: ActionsObservable<Action>, state$: StateObservable<State>): Observable<Action> {
    return action$.pipe(
      ofType<Action, Action>(IDENTITY_AUTHENTICATE),
      filter<Action>(() => {
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
      mergeMap(() => {
        return concat<Action>(
          of(loading()),
          EMPTY.pipe(
            mergeMap(() => {
              return of(loaded());
            })
          )
        );
      })
      // mergeMap<Action, Observable<Action>>(() => {
      //   return of<Action>(loading()).pipe(
      //     tap(console.log),
      //     mergeMap<unknown, Observable<Action>>(() => {
      //       const {
      //         value: {
      //           entranceInformation
      //         }
      //       } = state$;
      //
      //       return from<Promise<Superposition<VeauAccount, VeauAccountError | DataSourceError>>>(
      //         this.sessionQuery.findByEntranceInfo(entranceInformation)
      //       ).pipe<Action>(
      //         mergeMap<Superposition<VeauAccount, VeauAccountError | DataSourceError>, Observable<Action>>((superposition: Superposition<VeauAccount, VeauAccountError | DataSourceError>) => {
      //           return of<Action>(loaded()).pipe(
      //             mergeMap<never, Observable<Action>>(() => {
      //               return superposition.match<Observable<Action>>((veauAccount: VeauAccount) => {
      //                 return of<Action>(
      //                   identityAuthenticated(veauAccount),
      //                   pushToStatsList(),
      //                   identified()
      //                 );
      //               }, () => {
      //                 return of<Action>(raiseModal('AUTHENTICATION_FAILED', 'AUTHENTICATION_FAILED_DESCRIPTION'));
      //               });
      //             })
      //           );
      //         })
      //       );
      //     })
      //   );
      // })
    );
  }

  public accountNameTyped(action$: ActionsObservable<Action>, state$: StateObservable<State>): Observable<Action> {
    return action$.pipe<EntranceAccountNameTypedAction, Action>(
      ofType<Action, EntranceAccountNameTypedAction>(ENTRANCE_ACCOUNT_NAME_TYPED),
      map<EntranceAccountNameTypedAction, Action>((action: EntranceAccountNameTypedAction) => {
        const {
          value: {
            entranceInformation
          }
        } = state$;

        const newInfo: EntranceInformation = EntranceInformation.of(
          action.account,
          entranceInformation.getPassword()
        );

        return updateEntranceInformation(newInfo);
      })
    );
  }

  public passwordTyped(action$: ActionsObservable<Action>, state$: StateObservable<State>): Observable<Action> {
    return action$.pipe<EntrancePasswordTypedAction, Action>(
      ofType<Action, EntrancePasswordTypedAction>(ENTRANCE_PASSWORD_TYPED),
      map<EntrancePasswordTypedAction, Action>((action: EntrancePasswordTypedAction) => {
        const {
          value: {
            entranceInformation
          }
        } = state$;

        const newInfo: EntranceInformation = EntranceInformation.of(
          entranceInformation.getAccount(),
          action.password
        );

        return updateEntranceInformation(newInfo);
      })
    );
  }
}
