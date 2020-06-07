import { inject, injectable } from 'inversify';
import { ActionsObservable, ofType, StateObservable } from 'redux-observable';
import { concat, EMPTY, from, merge, Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { DataSourceError } from '@jamashita/publikum-error';
import { Superposition } from '@jamashita/publikum-monad';

import { Type } from '../../Container/Types';
import { NoSuchElementError } from '../../Query/Error/NoSuchElementError';
import { IIdentityQuery } from '../../Query/Interface/IIdentityQuery';
import { ILanguageQuery } from '../../Query/Interface/ILanguageQuery';
import { ILocaleQuery } from '../../Query/Interface/ILocaleQuery';
import { LanguageIdentificationService } from '../../Service/LanguageIdentificationService';
import { AccountName } from '../../VO/Account/AccountName';
import { IdentityError } from '../../VO/Identity/Error/IdentityError';
import { Identity } from '../../VO/Identity/Identity';
import { LanguageError } from '../../VO/Language/Error/LanguageError';
import { ISO639 } from '../../VO/Language/ISO639';
import { Language } from '../../VO/Language/Language';
import { LocaleError } from '../../VO/Locale/Error/LocaleError';
import { Locale } from '../../VO/Locale/Locale';
import { SystemSupportLanguage } from '../../VO/System/SystemSupportLanguage';
import { VeauAccountID } from '../../VO/VeauAccount/VeauAccountID';
import { IDENTITY_INITIALIZE, VeauAction } from '../Action';
import { identified, identityAuthenticated } from '../ActionCreator/IdentityActionCreator';
import { loaded, loading } from '../ActionCreator/LoadingActionCreator';
import { defineLocale } from '../ActionCreator/LocaleActionCreator';
import { raiseModal } from '../ActionCreator/ModalActionCreator';
import { pushToEntrance, pushToStatsList } from '../ActionCreator/RedirectActionCreator';
import { Endpoints } from '../Endpoints';
import { State } from '../State';

@injectable()
export class IdentityEpic {
  private readonly identityQuery: IIdentityQuery;
  private readonly localeQuery: ILocaleQuery;
  private readonly languageQuery: ILanguageQuery;

  public constructor(
    @inject(Type.IdentityVaultQuery) identityQuery: IIdentityQuery,
    @inject(Type.LocaleVaultQuery) localeQuery: ILocaleQuery,
    @inject(Type.LanguageVaultQuery) languageQuery: ILanguageQuery
  ) {
    this.identityQuery = identityQuery;
    this.localeQuery = localeQuery;
    this.languageQuery = languageQuery;
  }

  public init(action$: ActionsObservable<VeauAction>, state$: StateObservable<State>): Observable<VeauAction> {
    return merge<VeauAction>(this.initIdentity(state$), this.initialize(action$, state$));
  }

  public initIdentity(state$: StateObservable<State>): Observable<VeauAction> {
    return EMPTY.pipe<VeauAction>(
      mergeMap<VeauAction, Observable<VeauAction>>(() => {
        return concat<VeauAction>(
          of<VeauAction>(loading()),
          from<Promise<Superposition<Locale, LocaleError | DataSourceError>>>(this.localeQuery.all()).pipe<VeauAction>(
            mergeMap<Superposition<Locale, LocaleError | DataSourceError>, Observable<VeauAction>>(
              (superposition1: Superposition<Locale, LocaleError | DataSourceError>) => {
                return concat<VeauAction>(
                  of<VeauAction>(loaded()),
                  mergeMap<VeauAction, Observable<VeauAction>>(() => {
                    return superposition1.transform<Observable<VeauAction>>(
                      (locale: Locale) => {
                        return of<VeauAction>(defineLocale(locale));
                      },
                      () => {
                        return of<VeauAction>(raiseModal('CONNECTION_ERROR', 'CONNECTION_ERROR_DESCRIPTION'));
                      }
                    );
                  }),
                  mergeMap<VeauAction, Observable<VeauAction>>(() => {
                    return from<Promise<Superposition<Identity, IdentityError | DataSourceError>>>(
                      this.identityQuery.find()
                    ).pipe<VeauAction>(
                      mergeMap<Superposition<Identity, IdentityError | DataSourceError>, Observable<VeauAction>>(
                        (superposition2: Superposition<Identity, IdentityError | DataSourceError>) => {
                          return concat<VeauAction>(
                            superposition2.transform<Observable<VeauAction>>(
                              (identity: Identity) => {
                                const actions: Array<VeauAction> = [identityAuthenticated(identity), identified()];

                                if (location.pathname === Endpoints.ENTRANCE) {
                                  actions.push(pushToStatsList());
                                }

                                return of<VeauAction>(...actions);
                              },
                              () => {
                                return of<VeauAction>();
                              }
                            ),
                            mergeMap<VeauAction, Observable<VeauAction>>(() => {
                              const supportLanguage: SystemSupportLanguage = LanguageIdentificationService.toSupportLanguage(
                                navigator.language
                              );
                              const iso639: ISO639 = ISO639.of(supportLanguage);

                              return from<
                                Promise<Superposition<Language, LanguageError | NoSuchElementError | DataSourceError>>
                              >(this.languageQuery.findByISO639(iso639)).pipe<VeauAction>(
                                mergeMap<
                                  Superposition<Language, LanguageError | NoSuchElementError | DataSourceError>,
                                  Observable<VeauAction>
                                >(
                                  (
                                    superposition3: Superposition<
                                      Language,
                                      LanguageError | NoSuchElementError | DataSourceError
                                    >
                                  ) => {
                                    return superposition3.transform<Observable<VeauAction>>(
                                      (language: Language) => {
                                        // prettier-ignore
                                        const {
                                          value: {
                                            identity
                                          }
                                        } = state$;

                                        return of<VeauAction>(
                                          identityAuthenticated(
                                            Identity.of(
                                              identity.getVeauAccountID(),
                                              identity.getAccountName(),
                                              language,
                                              identity.getRegion()
                                            )
                                          ),
                                          pushToEntrance()
                                        );
                                      },
                                      () => {
                                        return of<VeauAction>(
                                          raiseModal('CONNECTION_ERROR', 'CONNECTION_ERROR_DESCRIPTION')
                                        );
                                      }
                                    );
                                  }
                                )
                              );
                            })
                          );
                        }
                      )
                    );
                  })
                );
              }
            )
          )
        );
      })
    );
  }

  public initialize(action$: ActionsObservable<VeauAction>, state$: StateObservable<State>): Observable<VeauAction> {
    return action$.pipe<VeauAction, VeauAction>(
      ofType<VeauAction, VeauAction>(IDENTITY_INITIALIZE),
      map<VeauAction, VeauAction>(() => {
        // prettier-ignore
        const {
          value: {
            identity
          }
        } = state$;

        return identityAuthenticated(
          Identity.of(VeauAccountID.generate(), AccountName.empty(), identity.getLanguage(), identity.getRegion())
        );
      })
    );
  }
}
