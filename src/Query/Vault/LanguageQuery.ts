import { DataSourceError } from '@jamashita/anden-error';
import { Nullable } from '@jamashita/anden-type';
import { Superposition } from '@jamashita/genitore-superposition';
import { Unscharferelation, UnscharferelationError } from '@jamashita/genitore-unscharferelation';
import { inject, injectable } from 'inversify';
import { Type } from '../../Container/Types';
import { LanguageError } from '../../VO/Language/Error/LanguageError';
import { ISO639 } from '../../VO/Language/ISO639';
import { Language } from '../../VO/Language/Language';
import { LanguageID } from '../../VO/Language/LanguageID';
import { Languages } from '../../VO/Language/Languages';
import { LocaleError } from '../../VO/Locale/Error/LocaleError';
import { Locale } from '../../VO/Locale/Locale';
import { NoSuchElementError } from '../Error/NoSuchElementError';
import { ILanguageQuery } from '../Interface/ILanguageQuery';
import { ILocaleQuery } from '../Interface/ILocaleQuery';
import { IVaultQuery } from './Interface/IVaultQuery';

@injectable()
export class LanguageQuery implements ILanguageQuery, IVaultQuery {
  public readonly noun: 'LanguageQuery' = 'LanguageQuery';
  public readonly source: 'Vault' = 'Vault';
  private readonly localeQuery: ILocaleQuery;

  public constructor(@inject(Type.LocaleVaultQuery) localeQuery: ILocaleQuery) {
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
    return this.all().map<Language, DataSourceError | LanguageError | UnscharferelationError>((languages: Languages) => {
      const language: Nullable<Language> = languages.find((l: Language) => {
        return l.getISO639().equals(iso639);
      });

      return Unscharferelation.maybe<Language>(language).toSuperposition();
    }).recover<Language, DataSourceError | LanguageError | NoSuchElementError>((err: DataSourceError | LanguageError | UnscharferelationError) => {
      if (err instanceof UnscharferelationError) {
        throw new NoSuchElementError(iso639.get());
      }

      throw err;
    }, LanguageError, NoSuchElementError, DataSourceError);
  }
}
