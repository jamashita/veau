import { Nullable } from '@jamashita/anden-type';
import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition, Unscharferelation, UnscharferelationError } from '@jamashita/genitore';
import { LanguageError } from '../../../domain/vo/Language/error/LanguageError';
import { ISO639 } from '../../../domain/vo/Language/ISO639';
import { Language } from '../../../domain/vo/Language/Language';
import { Languages } from '../../../domain/vo/Language/Languages';
import { NoSuchElementError } from '../error/NoSuchElementError';

export class LanguageQueryFindByISO639<E extends DataSourceError = DataSourceError> {
  private readonly all: Superposition<Languages, E | LanguageError>;

  public static of<ET extends DataSourceError>(all: Superposition<Languages, ET | LanguageError>): LanguageQueryFindByISO639<ET> {
    return new LanguageQueryFindByISO639(all);
  }

  protected constructor(all: Superposition<Languages, E | LanguageError>) {
    this.all = all;
  }

  public findByISO639(iso639: ISO639): Superposition<Language, E | LanguageError | NoSuchElementError> {
    return this.all.map<Language, E | LanguageError | UnscharferelationError>((languages: Languages) => {
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
