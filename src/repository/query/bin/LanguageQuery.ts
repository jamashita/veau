import { Nullable } from '@jamashita/anden-type';
import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition, Unscharferelation, UnscharferelationError } from '@jamashita/genitore';
import { inject, injectable } from 'inversify';
import { Type } from '../../../container/Types';
import { LanguageError } from '../../../domain/vo/Language/error/LanguageError';
import { ISO639 } from '../../../domain/vo/Language/ISO639';
import { Language } from '../../../domain/vo/Language/Language';
import { LanguageID } from '../../../domain/vo/Language/LanguageID';
import { Languages } from '../../../domain/vo/Language/Languages';
import { LocaleError } from '../../../domain/vo/Locale/error/LocaleError';
import { Locale } from '../../../domain/vo/Locale/Locale';
import { NoSuchElementError } from '../error/NoSuchElementError';
import { ILanguageQuery } from '../interface/ILanguageQuery';
import { ILocaleQuery } from '../interface/ILocaleQuery';
import { LanguageQueryFindByISO639 } from '../trait/LanguageQueryFindByISO639';
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

  // TODO TRAIT
  public find(languageID: LanguageID): Superposition<Language, DataSourceError | LanguageError | NoSuchElementError> {
    return this.all().map<Language, DataSourceError | LanguageError | UnscharferelationError>((languages: Languages) => {
      const language: Nullable<Language> = languages.find((l: Language) => {
        return l.getLanguageID().equals(languageID);
      });

      return Unscharferelation.maybe<Language>(language).toSuperposition();
    }).recover<Language, DataSourceError | LanguageError | NoSuchElementError>((err: DataSourceError | LanguageError | UnscharferelationError) => {
      if (err instanceof UnscharferelationError) {
        throw new NoSuchElementError(languageID.get().get());
      }

      throw err;
    }, LanguageError, NoSuchElementError, DataSourceError);
  }

  public findByISO639(iso639: ISO639): Superposition<Language, DataSourceError | LanguageError | NoSuchElementError> {
    return LanguageQueryFindByISO639.of(this.all()).findByISO639(iso639);
  }
}
