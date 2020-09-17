import { DataSourceError } from '@jamashita/publikum-error';
import { Superposition, Unscharferelation, UnscharferelationError } from '@jamashita/publikum-monad';
import { Nullable } from '@jamashita/publikum-type';
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

  public all(): Superposition<Languages, LanguageError | DataSourceError> {
    return this.localeQuery.all().map<Languages, LocaleError | DataSourceError>((locale: Locale) => {
      return locale.getLanguages();
    }).recover<Languages, LanguageError | DataSourceError>((err: LocaleError | DataSourceError) => {
      if (err instanceof LocaleError) {
        throw new LanguageError('LanguageQuery.all()', err);
      }

      throw err;
    }, LanguageError, DataSourceError);
  }

  public find(languageID: LanguageID): Superposition<Language, LanguageError | NoSuchElementError | DataSourceError> {
    return this.all().map<Language, LanguageError | UnscharferelationError | DataSourceError>((languages: Languages) => {
      const language: Nullable<Language> = languages.find((l: Language) => {
        return l.getLanguageID().equals(languageID);
      });

      return Unscharferelation.maybe<Language>(language).toSuperposition();
    }).recover<Language, LanguageError | NoSuchElementError | DataSourceError>((err: LanguageError | UnscharferelationError | DataSourceError) => {
      if (err instanceof UnscharferelationError) {
        throw new NoSuchElementError(languageID.get().get());
      }

      throw err;
    }, LanguageError, NoSuchElementError, DataSourceError);
  }

  public findByISO639(iso639: ISO639): Superposition<Language, LanguageError | NoSuchElementError | DataSourceError> {
    return this.all().map<Language, LanguageError | UnscharferelationError | DataSourceError>((languages: Languages) => {
      const language: Nullable<Language> = languages.find((l: Language) => {
        return l.getISO639().equals(iso639);
      });

      return Unscharferelation.maybe<Language>(language).toSuperposition();
    }).recover<Language, LanguageError | NoSuchElementError | DataSourceError>((err: LanguageError | UnscharferelationError | DataSourceError) => {
      if (err instanceof UnscharferelationError) {
        throw new NoSuchElementError(iso639.get());
      }

      throw err;
    }, LanguageError, NoSuchElementError, DataSourceError);
  }
}
