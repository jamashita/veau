import { SagaIterator } from '@redux-saga/types';
import { inject, injectable } from 'inversify';
import { all, call, Effect, fork, put, select, take } from 'redux-saga/effects';
import { TYPE } from '../../veau-container/Types';
import { NoSuchElementError } from '../../veau-error/NoSuchElementError';
import { UnauthorizedError } from '../../veau-error/UnauthorizedError';
import { VeauAccountError } from '../../veau-error/VeauAccountError';
import { DataSourceError } from '../../veau-general/DataSourceError';
import { Try } from '../../veau-general/Try/Try';
import { ILanguageQuery } from '../../veau-query/Interfaces/ILanguageQuery';
import { ILocaleQuery } from '../../veau-query/Interfaces/ILocaleQuery';
import { ISessionQuery } from '../../veau-query/Interfaces/ISessionQuery';
import { LanguageIdentificationService } from '../../veau-service/LanguageIdentificationService';
import { AccountName } from '../../veau-vo/AccountName';
import { ISO639 } from '../../veau-vo/ISO639';
import { Language } from '../../veau-vo/Language';
import { Locale } from '../../veau-vo/Locale';
import { VeauAccount } from '../../veau-vo/VeauAccount';
import { VeauAccountID } from '../../veau-vo/VeauAccountID';
import { ACTION } from '../actions/Action';
import { identified, identityAuthenticated } from '../actions/IdentityAction';
import { loaded, loading } from '../actions/LoadingAction';
import { defineLocale } from '../actions/LocaleAction';
import { raiseModal } from '../actions/ModalAction';
import { pushToEntrance, pushToStatsList } from '../actions/RedirectAction';
import { Endpoints } from '../Endpoints';
import { State } from '../State';

@injectable()
export class IdentitySaga {
  private readonly sessionQuery: ISessionQuery;
  private readonly localeQuery: ILocaleQuery;
  private readonly languageQuery: ILanguageQuery;

  public constructor(
    @inject(TYPE.SessionAJAXQuery) sessionQuery: ISessionQuery,
    @inject(TYPE.LocaleVaultQuery) localeQuery: ILocaleQuery,
    @inject(TYPE.LanguageVaultQuery) LanguageQuery: ILanguageQuery
  ) {
    this.sessionQuery = sessionQuery;
    this.localeQuery = localeQuery;
    this.languageQuery = LanguageQuery;
  }

  public *init(): IterableIterator<unknown> {
    yield fork(this.initIdentity);
    yield fork(this.initialize);
  }

  private *initIdentity(): SagaIterator<void> {
    yield put(loading());

    const trial1: Try<Locale, DataSourceError> = yield call((): Promise<Try<Locale, DataSourceError>> => {
      return this.localeQuery.all();
    });

    yield put(loaded());

    yield trial1.match<Effect>((locale: Locale) => {
      return put(defineLocale(locale));
    }, () => {
      return put(raiseModal('CONNECTION_ERROR', 'CONNECTION_ERROR_DESCRIPTION'));
    });

    const trial2: Try<VeauAccount, VeauAccountError | UnauthorizedError | DataSourceError> = yield call((): Promise<Try<VeauAccount, VeauAccountError | UnauthorizedError | DataSourceError>> => {
      return this.sessionQuery.find();
    });

    if (trial2.isSuccess()) {
      const effects: Array<Effect> = [
        put(identityAuthenticated(trial2.get())),
        put(identified())
      ];

      if (location.pathname === Endpoints.ENTRANCE) {
        effects.push(put(pushToStatsList()));
      }

      yield all(effects);
    }

    const newLanguage: string = LanguageIdentificationService.toISO639(navigator.language);
    const iso639: ISO639 = ISO639.of(newLanguage);
    const state: State = yield select();

    const {
      identity
    } = state;

    const trial3: Try<Language, NoSuchElementError | DataSourceError> = yield call((): Promise<Try<Language, NoSuchElementError | DataSourceError>> => {
      return this.languageQuery.findByISO639(iso639);
    });

    yield trial3.match<Effect>((language: Language) => {
      const veauAccount: VeauAccount = VeauAccount.of(identity.getVeauAccountID(), identity.getAccount(), language, identity.getRegion());

      return all([
        put(identityAuthenticated(veauAccount)),
        put(pushToEntrance())
      ]);
    }, () => {
      return put(raiseModal('CONNECTION_ERROR', 'CONNECTION_ERROR_DESCRIPTION'));
    });
  }

  private *initialize(): SagaIterator<unknown> {
    while (true) {
      yield take(ACTION.IDENTITY_INITIALIZE);
      const state: State = yield select();

      const {
        identity
      } = state;

      const veauAccount: VeauAccount = VeauAccount.of(VeauAccountID.generate(), AccountName.default(), identity.getLanguage(), identity.getRegion());

      yield put(identityAuthenticated(veauAccount));
    }
  }
}
