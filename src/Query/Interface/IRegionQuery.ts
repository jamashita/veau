import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore';
import { RegionError } from '../../domain/VO/Region/Error/RegionError';
import { ISO3166 } from '../../domain/VO/Region/ISO3166';
import { Region } from '../../domain/VO/Region/Region';
import { RegionID } from '../../domain/VO/Region/RegionID';
import { Regions } from '../../domain/VO/Region/Regions';
import { NoSuchElementError } from '../Error/NoSuchElementError';
import { IQuery } from './IQuery';

export interface IRegionQuery<E extends DataSourceError = DataSourceError> extends IQuery<'RegionQuery'> {
  readonly noun: 'RegionQuery';

  all(): Superposition<Regions, E | RegionError>;

  find(regionID: RegionID): Superposition<Region, E | NoSuchElementError | RegionError>;

  findByISO3166(iso3166: ISO3166): Superposition<Region, E | NoSuchElementError | RegionError>;
}
