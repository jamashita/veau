import { NoSuchElementError } from '../../veau-error/NoSuchElementError';
import { Try } from '../../veau-general/Try/Try';
import { ISO3166 } from '../../veau-vo/ISO3166';
import { Region } from '../../veau-vo/Region';
import { Regions } from '../../veau-vo/Regions';
import { IQuery } from './IQuery';

export interface IRegionQuery extends IQuery {
  readonly noun: 'RegionQuery';

  all(): Promise<Try<Regions, NoSuchElementError>>;

  findByISO3166(iso3166: ISO3166): Promise<Try<Region, NoSuchElementError>>;
}