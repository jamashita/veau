import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore-superposition';
import { RegionError } from '../../../domain/vo/Region/error/RegionError.js';
import { ISO3166 } from '../../../domain/vo/Region/ISO3166.js';
import { Region } from '../../../domain/vo/Region/Region.js';
import { RegionID } from '../../../domain/vo/Region/RegionID.js';
import { Regions } from '../../../domain/vo/Region/Regions.js';
import { NoSuchElementError } from '../error/NoSuchElementError.js';
import { IQuery } from './IQuery.js';

export interface IRegionQuery<E extends DataSourceError = DataSourceError> extends IQuery<'RegionQuery'> {
  readonly noun: 'RegionQuery';

  all(): Superposition<Regions, E | RegionError>;

  find(regionID: RegionID): Superposition<Region, E | NoSuchElementError | RegionError>;

  findByISO3166(iso3166: ISO3166): Superposition<Region, E | NoSuchElementError | RegionError>;
}
