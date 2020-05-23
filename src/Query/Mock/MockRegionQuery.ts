import { DataSourceError, Superposition, UnimplementedError } from 'publikum';

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

  public all(): Promise<Superposition<Regions, RegionsError | DataSourceError>> {
    return Promise.reject<Superposition<Regions, RegionsError | DataSourceError>>(new UnimplementedError());
  }

  public find(): Promise<Superposition<Region, RegionError | NoSuchElementError | DataSourceError>> {
    return Promise.reject<Superposition<Region, RegionError | NoSuchElementError | DataSourceError>>(
      new UnimplementedError()
    );
  }

  public findByISO3166(): Promise<Superposition<Region, RegionError | NoSuchElementError | DataSourceError>> {
    return Promise.reject<Superposition<Region, RegionError | NoSuchElementError | DataSourceError>>(
      new UnimplementedError()
    );
  }
}
