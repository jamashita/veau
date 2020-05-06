// @ts-nocheck
import { inject, injectable } from 'inversify';
import { ActionsObservable, ofType, StateObservable } from 'redux-observable';
import { merge, NEVER, Observable } from 'rxjs';
import { map, mapTo } from 'rxjs/operators';
import { TYPE } from '../../Container/Types';
import { ILanguageQuery } from '../../Query/Interface/ILanguageQuery';
import { ILocaleQuery } from '../../Query/Interface/ILocaleQuery';
import { ISessionQuery } from '../../Query/Interface/ISessionQuery';
import { AccountName } from '../../VO/AccountName';
import { Identity } from '../../VO/Identity';
import { VeauAccountID } from '../../VO/VeauAccountID';
import { Action, IDENTITY_INITIALIZE } from '../Action/Action';
import { identityAuthenticated } from '../Action/IdentityAction';
import { loading } from '../Action/LoadingAction';
import { State } from '../State';

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
    const {
      value: {
        identity
      }
    } = state$;

    return NEVER.pipe(
      mapTo<Action, Action>(loading())
      // mergeMap<Action, Observable<Action>>(() => {
      //   return from<Promise<Superposition<Locale, DataSourceError>>>(
      //     this.localeQuery.all()
      //   ).pipe<Action>(
      //     mergeMap<Superposition<Locale, DataSourceError>, Observable<Action>>((superposition1: Superposition<Locale, DataSourceError>) => {
      //       return EMPTY.pipe<Action, Action, Action>(
      //         mapTo<never, Action>(loaded()),
      //         mergeMap<Action, Observable<Action>>(() => {
      //           return superposition1.match<Observable<Action>>((locale: Locale) => {
      //             return of<Action>(defineLocale(locale));
      //           }, () => {
      //             return of<Action>(raiseModal('CONNECTION_ERROR', 'CONNECTION_ERROR_DESCRIPTION'));
      //           });
      //         }),
      //         mergeMap<Action, Observable<Action>>(() => {
      //           return from<Promise<Superposition<VeauAccount, VeauAccountError | UnauthorizedError | DataSourceError>>>(
      //             this.sessionQuery.find()
      //           ).pipe<Action, Action>(
      //             mergeMap<Superposition<VeauAccount, VeauAccountError | UnauthorizedError | DataSourceError>, Observable<Action>>((superposition2: Superposition<VeauAccount, VeauAccountError | UnauthorizedError | DataSourceError>) => {
      //               return EMPTY.pipe<never, Action>(
      //                 filter<never>(() => {
      //                   return superposition2.isAlive();
      //                 }),
      //                 mergeMap<never, Observable<Action>>(() => {
      //                   const actions: Array<Action> = [
      //                     identityAuthenticated(superposition2.get()),
      //                     identified()
      //                   ];
      //
      //                   if (location.pathname === Endpoints.ENTRANCE) {
      //                     actions.push(pushToStatsList());
      //                   }
      //
      //                   return of<Action>(...actions);
      //                 })
      //               );
      //             }),
      //             mergeMap<Action, Observable<Action>>(() => {
      //               const supportLanguage: SystemSupportLanguage = LanguageIdentificationService.toSupportLanguage(
      //                 navigator.language
      //               );
      //               const iso639: ISO639 = ISO639.of(supportLanguage);
      //
      //               return from<Promise<Superposition<Language, NoSuchElementError | DataSourceError>>>(
      //                 this.languageQuery.findByISO639(iso639)
      //               ).pipe<Action>(
      //                 mergeMap<Superposition<Language, NoSuchElementError | DataSourceError>, Observable<Action>>((superposition3: Superposition<Language, NoSuchElementError | DataSourceError>) => {
      //                   return superposition3.match<Observable<Action>>((language: Language) => {
      //                     const veauAccount: VeauAccount = VeauAccount.of(
      //                       identity.getVeauAccountID(),
      //                       identity.getAccount(),
      //                       language,
      //                       identity.getRegion()
      //                     );
      //
      //                     return of<Action>(
      //                       identityAuthenticated(veauAccount),
      //                       pushToEntrance()
      //                     );
      //                   }, () => {
      //                     return of<Action>(raiseModal('CONNECTION_ERROR', 'CONNECTION_ERROR_DESCRIPTION'));
      //                   });
      //                 })
      //               );
      //             })
      //           );
      //         })
      //       );
      //     })
      //   );
      // })
    );
  }

  public initialize(action$: ActionsObservable<Action>, state$: StateObservable<State>): Observable<Action> {
    const {
      value: {
        identity
      }
    } = state$;

    return action$.pipe<Action, Action>(
      ofType<Action, Action>(IDENTITY_INITIALIZE),
      map<Action, Action>(() => {
        const newIdentity: Identity = Identity.of(
          VeauAccountID.generate(),
          identity.getLanguage(),
          identity.getLanguage(),
          AccountName.empty()
        );

        return identityAuthenticated(newIdentity);
      })
    );
  }
}
