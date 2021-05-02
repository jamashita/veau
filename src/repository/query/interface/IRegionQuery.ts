import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore';
import { RegionError } from '../../domain/vo/Region/Error/RegionError';
import { ISO3166 } from '../../domain/vo/Region/ISO3166';
import { Region } from '../../domain/vo/Region/Region';
import { RegionID } from '../../domain/vo/Region/RegionID';
import { Regions } from '../../domain/vo/Region/Regions';
import { NoSuchElementError } from '../error/NoSuchElementError';
import { IQuery } from './IQuery';

export interface IRegionQuery<E extends DataSourceError = DataSourceError> extends IQuery<'RegionQuery'> {
  readonly noun: 'RegionQuery';

  all(): Superposition<Regions, E | RegionError>;

  find(regionID: RegionID): Superposition<Region, E | NoSuchElementError | RegionError>;

  findByISO3166(iso3166: ISO3166): Superposition<Region, E | NoSuchElementError | RegionError>;
}
