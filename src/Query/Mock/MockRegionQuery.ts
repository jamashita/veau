import { NoSuchElementError } from '../../Error/NoSuchElementError';
import { DataSourceError } from '../../General/DataSourceError';
import { Superposition } from '../../General/Superposition/Superposition';
import { UnimplementedError } from '../../General/UnimplementedError';
import { ISO3166 } from '../../VO/ISO3166';
import { Region } from '../../VO/Region';
import { Regions } from '../../VO/Regions';
import { IMockQuery } from '../Interface/IMockQuery';
import { IRegionQuery } from '../Interface/IRegionQuery';

export class MockRegionQuery implements IRegionQuery, IMockQuery {
  public readonly noun: 'RegionQuery' = 'RegionQuery';
  public readonly source: 'Mock' = 'Mock';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public all(): Promise<Superposition<Regions, NoSuchElementError | DataSourceError>> {
    return Promise.reject<Superposition<Regions, NoSuchElementError | DataSourceError>>(new UnimplementedError());
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public findByISO3166(iso3166: ISO3166): Promise<Superposition<Region, NoSuchElementError | DataSourceError>> {
    return Promise.reject<Superposition<Region, NoSuchElementError | DataSourceError>>(new UnimplementedError());
  }
}
