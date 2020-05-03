import { DataSourceError, Superposition } from 'publikum';
import { NoSuchElementError } from '../../Error/NoSuchElementError';
import { RegionError } from '../../Error/RegionError';
import { RegionsError } from '../../Error/RegionsError';
import { ISO3166 } from '../../VO/ISO3166';
import { Region } from '../../VO/Region';
import { Regions } from '../../VO/Regions';
import { IQuery } from './IQuery';

export interface IRegionQuery extends IQuery {
  readonly noun: 'RegionQuery';

  all(): Promise<Superposition<Regions, RegionsError | DataSourceError>>;

  findByISO3166(iso3166: ISO3166): Promise<Superposition<Region, RegionError | NoSuchElementError | DataSourceError>>;
}
