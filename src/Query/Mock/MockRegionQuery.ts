import { DataSourceError, UnimplementedError } from '@jamashita/anden-error';
import { Superposition } from '@jamashita/genitore-superposition';
import { RegionError } from '../../VO/Region/Error/RegionError';
import { Region } from '../../VO/Region/Region';
import { Regions } from '../../VO/Region/Regions';
import { NoSuchElementError } from '../Error/NoSuchElementError';
import { IRegionQuery } from '../Interface/IRegionQuery';
import { IMockQuery } from './Interface/IMockQuery';

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
