import { inject, injectable } from 'inversify';
import { DataSourceError, Superposition } from 'publikum';
import { ActionsObservable, ofType, StateObservable } from 'redux-observable';
import { concat, EMPTY, from, merge, Observable, of } from 'rxjs';
import { map, mergeMap, filter } from 'rxjs/operators';
import { TYPE } from '../../Container/Types';
import { LanguageError } from '../../Error/LanguageError';
import { LocaleError } from '../../Error/LocaleError';
import { NoSuchElementError } from '../../Error/NoSuchElementError';
import { UnauthorizedError } from '../../Error/UnauthorizedError';
import { VeauAccountError } from '../../Error/VeauAccountError';
import { ILanguageQuery } from '../../Query/Interface/ILanguageQuery';
import { ILocaleQuery } from '../../Query/Interface/ILocaleQuery';
import { ISessionQuery } from '../../Query/Interface/ISessionQuery';
import { LanguageIdentificationService } from '../../Service/LanguageIdentificationService';
import { AccountName } from '../../VO/AccountName';
import { Identity } from '../../VO/Identity';
import { ISO639 } from '../../VO/ISO639';
import { Language } from '../../VO/Language';
import { Locale } from '../../VO/Locale';
import { SystemSupportLanguage } from '../../VO/SystemSupportLanguage';
import { VeauAccount } from '../../VO/VeauAccount';
import { VeauAccountID } from '../../VO/VeauAccountID';
import { Action, IDENTITY_INITIALIZE } from '../Action/Action';
import { identified, identityAuthenticated } from '../Action/IdentityAction';
import { loaded, loading } from '../Action/LoadingAction';
import { defineLocale } from '../Action/LocaleAction';
import { raiseModal } from '../Action/ModalAction';
import { pushToEntrance, pushToStatsList } from '../Action/RedirectAction';
import { State } from '../State';
import { Endpoints } from '../Endpoints';
@injectable()
export class IdentityEpic {
  private readonly sessionQuery: ISessionQuery;
  private readonly localeQuery: ILocaleQuery;
  private readonly languageQuery: ILanguageQuery;

  public constructor(
  @inject(TYPE.SessionAJAXQuery) sessionQuery: ISessionQuery,
    @inject(TYPE.LocaleVaultQuery) localeQuery: ILocaleQuery,
    @inject(TYPE.LanguageVaultQuery) languageQuery: ILanguageQuery
  ) {
    this.sessionQuery = sessionQuery;
    this.localeQuery = localeQuery;
    this.languageQuery = languageQuery;
  }

  public init(action$: ActionsObservable<Action>, state$: StateObservable<State>): Observable<Action> {
    return merge<Action, Action>(
      this.initIdentity(state$),
      this.initialize(action$, state$)
    );
  }

  public initIdentity(state$: StateObservable<State>): Observable<Action> {
    return EMPTY.pipe(
      mergeMap<Action, Observable<Action>>(() => {
        return concat(
          of(loading()),
          from<Promise<Superposition<Locale, LocaleError | DataSourceError>>>(
            this.localeQuery.all()
          ).pipe<Action>(
            mergeMap<Superposition<Locale, LocaleError | DataSourceError>, Observable<Action>>((superposition1: Superposition<Locale, LocaleError | DataSourceError>) => {
              return concat(
                of(loaded()),
                mergeMap<Action, Observable<Action>>(() => {
                  return superposition1.match<Observable<Action>>((locale: Locale) => {
                    return of<Action>(defineLocale(locale));
                  }, () => {
                    return of<Action>(
                      raiseModal('CONNECTION_ERROR', 'CONNECTION_ERROR_DESCRIPTION')
                    );
                  });
                }),
                mergeMap<Action, Observable<Action>>(() => {
                  return from<Promise<Superposition<VeauAccount, VeauAccountError | UnauthorizedError | DataSourceError>>>(
                    this.sessionQuery.find()
                  ).pipe<Action, Action>(
                    mergeMap<Superposition<VeauAccount, VeauAccountError | UnauthorizedError | DataSourceError>, Observable<Action>>((superposition2: Superposition<VeauAccount, VeauAccountError | UnauthorizedError | DataSourceError>) => {
                      return EMPTY.pipe<never, Action>(
                        filter<never>(() => {
                          return superposition2.isAlive();
                        }),
                        mergeMap<never, Observable<Action>>(() => {
                          const actions: Array<Action> = [
                            identityAuthenticated(superposition2.get()),
                            identified()
                          ];

                          if (location.pathname === Endpoints.ENTRANCE) {
                            actions.push(pushToStatsList());
                          }

                          return of<Action>(...actions);
                        })
                      );
                    }),
                    mergeMap<Action, Observable<Action>>(() => {
                      const supportLanguage: SystemSupportLanguage = LanguageIdentificationService.toSupportLanguage(
                        navigator.language
                      );
                      const iso639: ISO639 = ISO639.of(supportLanguage);

                      return from<Promise<Superposition<Language, LanguageError | NoSuchElementError | DataSourceError>>>(
                        this.languageQuery.findByISO639(iso639)
                      ).pipe<Action>(
                        mergeMap<Superposition<Language, LanguageError | NoSuchElementError | DataSourceError>, Observable<Action>>((superposition3: Superposition<Language, LanguageError | NoSuchElementError | DataSourceError>) => {
                          return superposition3.match<Observable<Action>>((language: Language) => {
                            const {
                              value: {
                                identity
                              }
                            } = state$;

                            return of<Action>(
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
                          }, () => {
                            return of<Action>(
                              raiseModal('CONNECTION_ERROR', 'CONNECTION_ERROR_DESCRIPTION')
                            );
                          });
                        })
                      );
                    })
                  );
                })
              );
            })
          )
        );
      })
    );
  }

  public initialize(action$: ActionsObservable<Action>, state$: StateObservable<State>): Observable<Action> {
    return action$.pipe<Action, Action>(
      ofType<Action, Action>(IDENTITY_INITIALIZE),
      map<Action, Action>(() => {
        const {
          value: {
            identity
          }
        } = state$;

        return identityAuthenticated(
          Identity.of(
            VeauAccountID.generate(),
            AccountName.empty(),
            identity.getLanguage(),
            identity.getRegion()
          )
        );
      })
    );
  }
}
