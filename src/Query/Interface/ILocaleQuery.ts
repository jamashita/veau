import { DataSourceError } from '../../General/DataSourceError';
import { Superposition } from '../../General/Superposition/Superposition';
import { Locale } from '../../VO/Locale';
import { IQuery } from './IQuery';

export interface ILocaleQuery extends IQuery {
  readonly noun: 'LocaleQuery';

  all(): Promise<Superposition<Locale, DataSourceError>>;
}
