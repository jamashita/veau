import { SagaIterator } from '@redux-saga/types';
import { inject, injectable } from 'inversify';
import { all, call, Effect, fork, put, select, take } from 'redux-saga/effects';
import { TYPE } from '../../Container/Types';
import { NoSuchElementError } from '../../Error/NoSuchElementError';
import { UnauthorizedError } from '../../Error/UnauthorizedError';
import { VeauAccountError } from '../../Error/VeauAccountError';
import { DataSourceError } from '../../General/DataSourceError';
import { Try } from '../../General/Superposition/Try';
import { ILanguageQuery } from '../../Query/Interface/ILanguageQuery';
import { ILocaleQuery } from '../../Query/Interface/ILocaleQuery';
import { ISessionQuery } from '../../Query/Interface/ISessionQuery';
import { LanguageIdentificationService } from '../../Service/LanguageIdentificationService';
import { AccountName } from '../../VO/AccountName';
import { ISO639 } from '../../VO/ISO639';
import { Language } from '../../VO/Language';
import { Locale } from '../../VO/Locale';
import { VeauAccount } from '../../VO/VeauAccount';
import { VeauAccountID } from '../../VO/VeauAccountID';
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

      const veauAccount: VeauAccount = VeauAccount.of(VeauAccountID.generate(), AccountName.empty(), identity.getLanguage(), identity.getRegion());

      yield put(identityAuthenticated(veauAccount));
    }
  }
}
