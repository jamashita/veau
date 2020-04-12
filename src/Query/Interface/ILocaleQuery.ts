import { DataSourceError } from '../../General/DataSourceError';
import { Try } from '../../General/Try/Try';
import { Locale } from '../../VO/Locale';
import { IQuery } from './IQuery';

export interface ILocaleQuery extends IQuery {
  readonly noun: 'LocaleQuery';

  all(): Promise<Try<Locale, DataSourceError>>;
}
