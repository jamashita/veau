import { DataSourceError, Superposition } from 'publikum';

import { RegionError } from '../../VO/Region/Error/RegionError';
import { RegionsError } from '../../VO/Region/Error/RegionsError';
import { ISO3166 } from '../../VO/Region/ISO3166';
import { Region } from '../../VO/Region/Region';
import { RegionID } from '../../VO/Region/RegionID';
import { Regions } from '../../VO/Region/Regions';
import { NoSuchElementError } from '../Error/NoSuchElementError';
import { IQuery } from './IQuery';

export interface IRegionQuery extends IQuery {
  readonly noun: 'RegionQuery';

  all(): Promise<Superposition<Regions, RegionsError | DataSourceError>>;

  find(regionID: RegionID): Promise<Superposition<Region, RegionError | NoSuchElementError | DataSourceError>>;

  findByISO3166(iso3166: ISO3166): Promise<Superposition<Region, RegionError | NoSuchElementError | DataSourceError>>;
}
