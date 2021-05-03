import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore';
import { inject, injectable } from 'inversify';
import { Type } from '../../../container/Types';
import { LanguageError } from '../../../domain/vo/Language/error/LanguageError';
import { ISO639 } from '../../../domain/vo/Language/ISO639';
import { Language } from '../../../domain/vo/Language/Language';
import { LanguageID } from '../../../domain/vo/Language/LanguageID';
import { Languages } from '../../../domain/vo/Language/Languages';
import { LocaleError } from '../../../domain/vo/Locale/error/LocaleError';
import { Locale } from '../../../domain/vo/Locale/Locale';
import { LanguageQueryFind } from '../abstract/LanguageQueryFind';
import { LanguageQueryFindByISO639 } from '../abstract/LanguageQueryFindByISO639';
import { NoSuchElementError } from '../error/NoSuchElementError';
import { ILanguageQuery } from '../interface/ILanguageQuery';
import { ILocaleQuery } from '../interface/ILocaleQuery';
import { IBinQuery } from './IBinQuery';

@injectable()
export class LanguageQuery implements ILanguageQuery, IBinQuery {
  public readonly noun: 'LanguageQuery' = 'LanguageQuery';
  public readonly source: 'Bin' = 'Bin';
  private readonly localeQuery: ILocaleQuery;

  public constructor(@inject(Type.LocaleBinQuery) localeQuery: ILocaleQuery) {
    this.localeQuery = localeQuery;
  }

  public all(): Superposition<Languages, DataSourceError | LanguageError> {
    return this.localeQuery.all().map<Languages, DataSourceError | LocaleError>((locale: Locale) => {
      return locale.getLanguages();
    }).recover<Languages, DataSourceError | LanguageError>((err: DataSourceError | LocaleError) => {
      if (err instanceof LocaleError) {
        throw new LanguageError('LanguageQuery.all()', err);
      }

      throw err;
    }, LanguageError, DataSourceError);
  }

  public find(languageID: LanguageID): Superposition<Language, DataSourceError | LanguageError | NoSuchElementError> {
    return LanguageQueryFind.of(this.all()).find(languageID);
  }

  public findByISO639(iso639: ISO639): Superposition<Language, DataSourceError | LanguageError | NoSuchElementError> {
    return LanguageQueryFindByISO639.of(this.all()).findByISO639(iso639);
  }
}
