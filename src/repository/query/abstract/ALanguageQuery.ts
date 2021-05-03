import { Nullable } from '@jamashita/anden-type';
import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition, Unscharferelation, UnscharferelationError } from '@jamashita/genitore';
import { injectable } from 'inversify';
import { LanguageError } from '../../../domain/vo/Language/error/LanguageError';
import { ISO639 } from '../../../domain/vo/Language/ISO639';
import { Language } from '../../../domain/vo/Language/Language';
import { LanguageID } from '../../../domain/vo/Language/LanguageID';
import { Languages } from '../../../domain/vo/Language/Languages';
import { NoSuchElementError } from '../error/NoSuchElementError';
import { ILanguageQuery } from '../interface/ILanguageQuery';

@injectable()
export abstract class ALanguageQuery<E extends DataSourceError = DataSourceError, S extends string = string> implements ILanguageQuery<E> {
  public readonly noun: 'LanguageQuery' = 'LanguageQuery';
  public abstract readonly source: S;

  public abstract all(): Superposition<Languages, E | LanguageError>;

  public find(languageID: LanguageID): Superposition<Language, E | LanguageError | NoSuchElementError> {
    return this.all().map<Language, E | LanguageError | UnscharferelationError>((languages: Languages) => {
      const language: Nullable<Language> = languages.find((l: Language) => {
        return l.getLanguageID().equals(languageID);
      });

      return Unscharferelation.maybe<Language>(language).toSuperposition();
    }).recover<Language, E | LanguageError | NoSuchElementError>((err: E | LanguageError | UnscharferelationError) => {
      if (err instanceof UnscharferelationError) {
        throw new NoSuchElementError(languageID.get().get());
      }

      // eslint-disable-next-line @typescript-eslint/no-throw-literal
      throw err;
    }, LanguageError, NoSuchElementError, DataSourceError);
  }

  public findByISO639(iso639: ISO639): Superposition<Language, E | LanguageError | NoSuchElementError> {
    return this.all().map<Language, E | LanguageError | UnscharferelationError>((languages: Languages) => {
      const language: Nullable<Language> = languages.find((l: Language) => {
        return l.getISO639().equals(iso639);
      });

      return Unscharferelation.maybe(language).toSuperposition();
    }).recover<Language, E | LanguageError | NoSuchElementError>((err: E | LanguageError | UnscharferelationError) => {
      if (err instanceof UnscharferelationError) {
        throw new NoSuchElementError(iso639.toString());
      }

      // eslint-disable-next-line @typescript-eslint/no-throw-literal
      throw err;
    }, LanguageError, NoSuchElementError, DataSourceError);
  }
}
