import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore';
import { RegionError } from '../../VO/Region/Error/RegionError';
import { ISO3166 } from '../../VO/Region/ISO3166';
import { Region } from '../../VO/Region/Region';
import { RegionID } from '../../VO/Region/RegionID';
import { Regions } from '../../VO/Region/Regions';
import { NoSuchElementError } from '../Error/NoSuchElementError';
import { IQuery } from './IQuery';

export interface IRegionQuery<E extends DataSourceError = DataSourceError> extends IQuery<'RegionQuery'> {
  readonly noun: 'RegionQuery';

  all(): Superposition<Regions, E | RegionError>;

  find(regionID: RegionID): Superposition<Region, E | NoSuchElementError | RegionError>;

  findByISO3166(iso3166: ISO3166): Superposition<Region, E | NoSuchElementError | RegionError>;
}
