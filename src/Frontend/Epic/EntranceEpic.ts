import { inject, injectable } from 'inversify';
import { DataSourceError, Superposition } from 'publikum';
import { ActionsObservable, ofType, StateObservable } from 'redux-observable';
import { concat, from, merge, Observable, of } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import { TYPE } from '../../Container/Types';
import { LanguageError } from '../../Error/LanguageError';
import { NoSuchElementError } from '../../Error/NoSuchElementError';
import { RegionError } from '../../Error/RegionError';
import { VeauAccountError } from '../../Error/VeauAccountError';
import { ILanguageQuery } from '../../Query/Interface/ILanguageQuery';
import { IRegionQuery } from '../../Query/Interface/IRegionQuery';
import { ISessionQuery } from '../../Query/Interface/ISessionQuery';
import { EntranceInformation } from '../../VO/EntranceInformation';
import { Identity } from '../../VO/Identity';
import { Language } from '../../VO/Language';
import { Region } from '../../VO/Region';
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
  private readonly sessionQuery: ISessionQuery;
  private readonly languageQuery: ILanguageQuery;
  private readonly regionQuery: IRegionQuery;

  public constructor(
  @inject(TYPE.SessionAJAXQuery) sessionQuery: ISessionQuery,
    @inject(TYPE.LanguageVaultQuery) languageQuery: ILanguageQuery,
    @inject(TYPE.RegionVaultQuery) regionQuery: IRegionQuery
  ) {
    this.sessionQuery = sessionQuery;
    this.languageQuery = languageQuery;
    this.regionQuery = regionQuery;
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
          of<Action>(loading()),
          mergeMap(() => {
            const {
              value: {
                entranceInformation
              }
            } = state$;

            return from<Promise<Superposition<VeauAccount, VeauAccountError | DataSourceError>>>(
              this.sessionQuery.findByEntranceInfo(entranceInformation)
            ).pipe<Action>(
              mergeMap((superposition: Superposition<VeauAccount, VeauAccountError | DataSourceError>) => {
                return concat<Action>(
                  of<Action>(loaded()),
                  mergeMap(() => {
                    return superposition.match((veauAccount: VeauAccount) => {
                      return from<Promise<[Superposition<Language, LanguageError | NoSuchElementError | DataSourceError>, Superposition<Region, RegionError | NoSuchElementError | DataSourceError>]>>(
                        Promise.all<Superposition<Language, LanguageError | NoSuchElementError | DataSourceError>, Superposition<Region, RegionError | NoSuchElementError | DataSourceError>>([
                          this.languageQuery.find(veauAccount.getLanguageID()),
                          this.regionQuery.find(veauAccount.getRegionID())
                        ])
                      ).pipe(
                        mergeMap(([
                          superposition1,
                          superposition2
                        ]: [Superposition<Language, LanguageError | NoSuchElementError | DataSourceError>, Superposition<Region, RegionError | NoSuchElementError | DataSourceError>]) => {
                          return superposition1.match<Observable<Action>>((language: Language) => {
                            return superposition2.match<Observable<Action>>((region: Region) => {
                              return of<Action>(
                                identityAuthenticated(
                                  Identity.of(
                                    veauAccount.getVeauAccountID(),
                                    veauAccount.getAccountName(),
                                    language,
                                    region
                                  )
                                ),
                                pushToStatsList(),
                                identified()
                              );
                            }, () => {
                              return of<Action>(
                                raiseModal('AUTHENTICATION_FAILED', 'AUTHENTICATION_FAILED_DESCRIPTION')
                              );
                            });
                          }, () => {
                            return of<Action>(
                              raiseModal('AUTHENTICATION_FAILED', 'AUTHENTICATION_FAILED_DESCRIPTION')
                            );
                          });
                        })
                      );
                    }, () => {
                      return of<Action>(
                        raiseModal('AUTHENTICATION_FAILED', 'AUTHENTICATION_FAILED_DESCRIPTION')
                      );
                    });
                  })
                );
              })
            );
          })
        );
      }
      )
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
