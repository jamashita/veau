import { DataSourceError } from '@jamashita/anden-error';
import { Superposition } from '@jamashita/genitore-superposition';
import { RegionError } from '../../VO/Region/Error/RegionError';
import { ISO3166 } from '../../VO/Region/ISO3166';
import { Region } from '../../VO/Region/Region';
import { RegionID } from '../../VO/Region/RegionID';
import { Regions } from '../../VO/Region/Regions';
import { NoSuchElementError } from '../Error/NoSuchElementError';
import { IQuery } from './IQuery';

export interface IRegionQuery<E extends DataSourceError = DataSourceError> extends IQuery<'RegionQuery'> {
  readonly noun: 'RegionQuery';

  all(): Superposition<Regions, RegionError | E>;

  find(regionID: RegionID): Superposition<Region, RegionError | NoSuchElementError | E>;

  findByISO3166(iso3166: ISO3166): Superposition<Region, RegionError | NoSuchElementError | E>;
}
