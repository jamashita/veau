import { fork, put, take } from 'redux-saga/effects';
import { Language } from '../../veau-vo/Language';
import { Region } from '../../veau-vo/Region';
import { ACTION } from '../actions/Action';
import { defineLanguages, defineRegions } from '../actions/LocaleAction';
import { ILocaleQuery } from '../queries/interfaces/ILocaleQuery';
import { LocaleAJAXQuery } from '../queries/LocaleAJAXQuery';

export class LocaleSaga {
  private static instance: LocaleSaga = new LocaleSaga();
  private static localeQuery: ILocaleQuery = LocaleAJAXQuery.getInstance();

  public static getInstance(): LocaleSaga {
    return LocaleSaga.instance;
  }

  private constructor() {
  }

  public *init(): IterableIterator<any> {
    yield fork(this.fetchLocales);
  }

  private *fetchLocales(): IterableIterator<any> {
    while (true) {
      yield take(ACTION.IDENTITY_IDENTIFIED);

      const languages: Array<Language> = yield LocaleSaga.localeQuery.allLanguages();
      const regions: Array<Region> = yield LocaleSaga.localeQuery.allRegions();

      yield put(defineLanguages(languages));
      yield put(defineRegions(regions));
    }
  }
}
