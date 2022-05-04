import { UnimplementedError } from '@jamashita/anden-error';
import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Schrodinger } from '@jamashita/genitore-schrodinger';
import { NoSuchElementError } from '../../../repository/query/error/NoSuchElementError';
import { Language } from '../Language';
import { LanguageError } from '../LanguageError';
import { LanguageRepository } from '../LanguageRepository';
import { Languages } from '../Languages';

export class MockLanguageRepository implements LanguageRepository {
  public all(): Promise<Schrodinger<Languages, DataSourceError | LanguageError>> {
    throw new UnimplementedError();
  }

  public createAll(): Promise<Schrodinger<unknown, DataSourceError>> {
    throw new UnimplementedError();
  }

  public deleteAll(): Promise<Schrodinger<unknown, DataSourceError>> {
    throw new UnimplementedError();
  }

  public find(): Promise<Schrodinger<Language, DataSourceError | LanguageError | NoSuchElementError>> {
    throw new UnimplementedError();
  }

  public findByISO639(): Promise<Schrodinger<Language, DataSourceError | LanguageError | NoSuchElementError>> {
    throw new UnimplementedError();
  }
}
