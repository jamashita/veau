import { Kind, Nullable } from '@jamashita/anden-type';
import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore-superposition';
import { injectable } from 'inversify';
import { LanguageError } from '../../domain/vo/Language/error/LanguageError.js';
import { ISO639 } from '../../domain/vo/Language/ISO639.js';
import { Language } from '../../domain/vo/Language/Language.js';
import { LanguageID } from '../../domain/vo/Language/LanguageID.js';
import { Languages } from '../../domain/vo/Language/Languages.js';
import { NoSuchElementError } from './error/NoSuchElementError.js';
import { ILanguageQuery } from './ILanguageQuery.js';

@injectable()
export abstract class ALanguageQuery<E extends DataSourceError = DataSourceError, S extends string = string> implements ILanguageQuery<E> {
  public readonly noun: 'LanguageQuery' = 'LanguageQuery';
  public abstract readonly source: S;

  public abstract all(): Superposition<Languages, E | LanguageError>;

  public find(languageID: LanguageID): Superposition<Language, E | LanguageError | NoSuchElementError> {
    return this.all().map<Language, E | LanguageError | NoSuchElementError>((languages: Languages) => {
      const language: Nullable<Language> = languages.find((l: Language) => {
        return l.getLanguageID().equals(languageID);
      });

      if (Kind.isNull(language)) {
        return Superposition.dead<Language, NoSuchElementError>(new NoSuchElementError(languageID.get().get()));
      }

      return Superposition.alive<Language, LanguageError>(language);
    }, LanguageError, NoSuchElementError, DataSourceError);
  }

  public findByISO639(iso639: ISO639): Superposition<Language, E | LanguageError | NoSuchElementError> {
    return this.all().map<Language, E | LanguageError | NoSuchElementError>((languages: Languages) => {
      const language: Nullable<Language> = languages.find((l: Language) => {
        return l.getISO639().equals(iso639);
      });

      if (Kind.isNull(language)) {
        return Superposition.dead<Language, NoSuchElementError>(new NoSuchElementError(iso639.get()));
      }

      return Superposition.alive<Language, LanguageError>(language);
    }, LanguageError, NoSuchElementError, DataSourceError);
  }
}
