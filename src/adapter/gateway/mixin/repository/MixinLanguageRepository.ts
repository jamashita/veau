import { UnimplementedError } from '@jamashita/anden-error';
import { Kind, Nullable } from '@jamashita/anden-type';
import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Alive, Dead, Schrodinger } from '@jamashita/genitore-schrodinger';
import { ISO639 } from '../../../../domain/Language/ISO639';
import { Language } from '../../../../domain/Language/Language';
import { LanguageError } from '../../../../domain/Language/LanguageError';
import { LanguageID } from '../../../../domain/Language/LanguageID';
import { LanguageRepository } from '../../../../domain/Language/LanguageRepository';
import { Languages } from '../../../../domain/Language/Languages';
import { NoSuchElementError } from '../../../../repository/query/error/NoSuchElementError';

export class MixinLanguageRepository<E extends DataSourceError = DataSourceError> implements LanguageRepository<E> {
  private readonly languages: Languages;

  public constructor(languages: Languages) {
    this.languages = languages;
  }

  public all(): Promise<Schrodinger<Languages, E | LanguageError>> {
    return Promise.reject(new UnimplementedError());
  }

  public createAll(): Promise<Schrodinger<unknown, E>> {
    return Promise.reject(new UnimplementedError());
  }

  public deleteAll(): Promise<Schrodinger<unknown, E>> {
    return Promise.reject(new UnimplementedError());
  }

  public find(id: LanguageID): Promise<Schrodinger<Language, E | LanguageError | NoSuchElementError>> {
    const language: Nullable<Language> = this.languages.find((l: Language) => {
      return l.getLanguageID().equals(id);
    });

    if (Kind.isNull(language)) {
      return Promise.resolve(Dead.of(new NoSuchElementError(id.get().get())));
    }

    return Promise.resolve(Alive.of(language));
  }

  public findByISO639(iso639: ISO639): Promise<Schrodinger<Language, E | LanguageError | NoSuchElementError>> {
    const language: Nullable<Language> = this.languages.find((l: Language) => {
      return l.getISO639().equals(iso639);
    });

    if (Kind.isNull(language)) {
      return Promise.resolve(Dead.of(new NoSuchElementError(iso639.get())));
    }

    return Promise.resolve(Alive.of(language));
  }
}
