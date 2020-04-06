import { AJAXError } from '../../veau-error/AJAXError';
import { NoSuchElementError } from '../../veau-error/NoSuchElementError';
import { Try } from '../../veau-general/Try/Try';
import { ISO3166 } from '../../veau-vo/ISO3166';
import { ISO639 } from '../../veau-vo/ISO639';
import { Language } from '../../veau-vo/Language';
import { Locale } from '../../veau-vo/Locale';
import { Region } from '../../veau-vo/Region';
import { IQuery } from './IQuery';

export interface ILocaleQuery extends IQuery {
  readonly noun: 'LocaleQuery';

  findByISO639(iso639: ISO639): Promise<Try<Language, NoSuchElementError | AJAXError>>;

  findByISO3166(iso3166: ISO3166): Promise<Try<Region, NoSuchElementError | AJAXError>>;

  all(): Promise<Try<Locale, AJAXError>>;
}
