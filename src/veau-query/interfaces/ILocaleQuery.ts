import { DataSourceError } from '../../veau-general/DataSourceError';
import { Try } from '../../veau-general/Try/Try';
import { Locale } from '../../veau-vo/Locale';
import { IQuery } from './IQuery';

export interface ILocaleQuery extends IQuery {
  readonly noun: 'LocaleQuery';

  all(): Promise<Try<Locale, DataSourceError>>;
}
