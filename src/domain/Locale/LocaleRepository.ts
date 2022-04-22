import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Schrodinger } from '@jamashita/genitore-schrodinger';
import { Locale } from './Locale';
import { LocaleError } from './LocaleError';

export interface LocaleRepository<E extends DataSourceError = DataSourceError> {
  all(): Promise<Schrodinger<Locale, E | LocaleError>>;

  create(locale: Locale): Promise<Schrodinger<unknown, E>>;
}
