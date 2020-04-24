import { DataSourceError, Superposition } from 'publikum';
import { Locale } from '../../VO/Locale';
import { IQuery } from './IQuery';

export interface ILocaleQuery extends IQuery {
  readonly noun: 'LocaleQuery';

  all(): Promise<Superposition<Locale, DataSourceError>>;
}
