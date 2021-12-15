import { UnimplementedError } from '@jamashita/anden-error';
import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore-superposition';
import { RegionError } from '../../../domain/vo/Region/error/RegionError.js';
import { Region } from '../../../domain/vo/Region/Region.js';
import { Regions } from '../../../domain/vo/Region/Regions.js';
import { NoSuchElementError } from '../error/NoSuchElementError.js';
import { IRegionQuery } from '../IRegionQuery.js';
import { IMockQuery } from './IMockQuery.js';

export class MockRegionQuery implements IRegionQuery, IMockQuery {
  public readonly noun: 'RegionQuery' = 'RegionQuery';
  public readonly source: 'Mock' = 'Mock';

  public all(): Superposition<Regions, DataSourceError | RegionError> {
    throw new UnimplementedError();
  }

  public find(): Superposition<Region, DataSourceError | NoSuchElementError | RegionError> {
    throw new UnimplementedError();
  }

  public findByISO3166(): Superposition<Region, DataSourceError | NoSuchElementError | RegionError> {
    throw new UnimplementedError();
  }
}
