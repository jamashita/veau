import { NoSuchElementError } from '../../Error/NoSuchElementError';
import { DataSourceError } from '../../General/DataSourceError';
import { Try } from '../../General/Superposition/Try';
import { ISO3166 } from '../../VO/ISO3166';
import { Region } from '../../VO/Region';
import { Regions } from '../../VO/Regions';
import { IQuery } from './IQuery';

export interface IRegionQuery extends IQuery {
  readonly noun: 'RegionQuery';

  all(): Promise<Try<Regions, NoSuchElementError | DataSourceError>>;

  findByISO3166(iso3166: ISO3166): Promise<Try<Region, NoSuchElementError | DataSourceError>>;
}
