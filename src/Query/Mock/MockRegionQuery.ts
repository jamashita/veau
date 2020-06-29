import { DataSourceError, UnimplementedError } from '@jamashita/publikum-error';
import { Superposition } from '@jamashita/publikum-monad';

import { RegionError } from '../../VO/Region/Error/RegionError';
import { RegionsError } from '../../VO/Region/Error/RegionsError';
import { Region } from '../../VO/Region/Region';
import { Regions } from '../../VO/Region/Regions';
import { NoSuchElementError } from '../Error/NoSuchElementError';
import { IRegionQuery } from '../Interface/IRegionQuery';
import { IMockQuery } from './Interface/IMockQuery';

export class MockRegionQuery implements IRegionQuery, IMockQuery {
  public readonly noun: 'RegionQuery' = 'RegionQuery';
  public readonly source: 'Mock' = 'Mock';

  public all(): Superposition<Regions, RegionsError | DataSourceError> {
    throw new UnimplementedError();
  }

  public find(): Superposition<Region, RegionError | NoSuchElementError | DataSourceError> {
    throw new UnimplementedError();
  }

  public findByISO3166(): Superposition<Region, RegionError | NoSuchElementError | DataSourceError> {
    throw new UnimplementedError();
  }
}
