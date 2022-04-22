import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Schrodinger } from '@jamashita/genitore-schrodinger';
import { NoSuchElementError } from '../../repository/query/error/NoSuchElementError';
import { ISO3166 } from './ISO3166';
import { Region } from './Region';
import { RegionError } from './RegionError';
import { RegionID } from './RegionID';
import { Regions } from './Regions';

export interface RegionRepository<E extends DataSourceError = DataSourceError> {
  all(): Promise<Schrodinger<Regions, E | RegionError>>;

  createAll(regions: Regions): Promise<Schrodinger<unknown, E>>;

  deleteAll(): Promise<Schrodinger<unknown, E>>;

  find(id: RegionID): Promise<Schrodinger<Region, E | NoSuchElementError | RegionError>>;

  findByISO3166(iso3166: ISO3166): Promise<Schrodinger<Region, E | NoSuchElementError | RegionError>>;
}
