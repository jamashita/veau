import { UnimplementedError } from '@jamashita/anden-error';
import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore';
import { RegionError } from '../../../domain/vo/Region/error/RegionError';
import { Region } from '../../../domain/vo/Region/Region';
import { Regions } from '../../../domain/vo/Region/Regions';
import { NoSuchElementError } from '../error/NoSuchElementError';
import { IRegionQuery } from '../interface/IRegionQuery';
import { IMockQuery } from './IMockQuery';

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
