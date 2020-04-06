import { NoSuchElementError } from '../../veau-error/NoSuchElementError';
import { SourceError } from '../../veau-general/SourceError';
import { Try } from '../../veau-general/Try/Try';
import { ISO3166 } from '../../veau-vo/ISO3166';
import { ISO639 } from '../../veau-vo/ISO639';
import { Language } from '../../veau-vo/Language';
import { Locale } from '../../veau-vo/Locale';
import { Region } from '../../veau-vo/Region';
import { IQuery } from './IQuery';

export interface ILocaleQuery<E extends SourceError> extends IQuery {
  readonly noun: 'LocaleQuery';

  findByISO639(iso639: ISO639): Promise<Try<Language, NoSuchElementError | E>>;

  findByISO3166(iso3166: ISO3166): Promise<Try<Region, NoSuchElementError | E>>;

  all(): Promise<Try<Locale, E>>;
}
