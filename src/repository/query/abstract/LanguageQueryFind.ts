import { Nullable } from '@jamashita/anden-type';
import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition, Unscharferelation, UnscharferelationError } from '@jamashita/genitore';
import { LanguageError } from '../../../domain/vo/Language/error/LanguageError';
import { Language } from '../../../domain/vo/Language/Language';
import { LanguageID } from '../../../domain/vo/Language/LanguageID';
import { Languages } from '../../../domain/vo/Language/Languages';
import { RegionError } from '../../../domain/vo/Region/error/RegionError';
import { NoSuchElementError } from '../error/NoSuchElementError';

export class LanguageQueryFind {
  private readonly all: Superposition<Languages, DataSourceError | RegionError>;

  public static of(all: Superposition<Languages, DataSourceError | RegionError>): LanguageQueryFind {
    return new LanguageQueryFind(all);
  }

  protected constructor(all: Superposition<Languages, DataSourceError | RegionError>) {
    this.all = all;
  }

  public find(languageID: LanguageID): Superposition<Language, DataSourceError | LanguageError | NoSuchElementError> {
    return this.all.map<Language, DataSourceError | LanguageError | UnscharferelationError>((languages: Languages) => {
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
}
