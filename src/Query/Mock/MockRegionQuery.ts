import { DataSourceError, Superposition, UnimplementedError } from 'publikum';
import { NoSuchElementError } from '../../Error/NoSuchElementError';
import { RegionError } from '../../Error/RegionError';
import { RegionsError } from '../../Error/RegionsError';
import { ISO3166 } from '../../VO/ISO3166';
import { Region } from '../../VO/Region';
import { RegionID } from '../../VO/RegionID';
import { Regions } from '../../VO/Regions';
import { IMockQuery } from '../Interface/IMockQuery';
import { IRegionQuery } from '../Interface/IRegionQuery';

export class MockRegionQuery implements IRegionQuery, IMockQuery {
  public readonly noun: 'RegionQuery' = 'RegionQuery';
  public readonly source: 'Mock' = 'Mock';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public all(): Promise<Superposition<Regions, RegionsError | DataSourceError>> {
    return Promise.reject<Superposition<Regions, RegionsError | DataSourceError>>(new UnimplementedError());
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public find(regionID: RegionID): Promise<Superposition<Region, RegionError | NoSuchElementError | DataSourceError>> {
    return Promise.reject<Superposition<Region, RegionError | NoSuchElementError | DataSourceError>>(
      new UnimplementedError()
    );
  }

  public findByISO3166(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    iso3166: ISO3166
  ): Promise<Superposition<Region, RegionError | NoSuchElementError | DataSourceError>> {
    return Promise.reject<Superposition<Region, RegionError | NoSuchElementError | DataSourceError>>(
      new UnimplementedError()
    );
  }
}
