import { Nullable } from '@jamashita/anden-type';
import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition, Unscharferelation, UnscharferelationError } from '@jamashita/genitore';
import { RegionError } from '../../../domain/vo/Region/error/RegionError';
import { ISO3166 } from '../../../domain/vo/Region/ISO3166';
import { Region } from '../../../domain/vo/Region/Region';
import { RegionID } from '../../../domain/vo/Region/RegionID';
import { Regions } from '../../../domain/vo/Region/Regions';
import { NoSuchElementError } from '../error/NoSuchElementError';
import { IRegionQuery } from '../interface/IRegionQuery';

export abstract class ARegionQuery<E extends DataSourceError = DataSourceError, S extends string = string> implements IRegionQuery {
  public readonly noun: 'RegionQuery' = 'RegionQuery';
  public abstract readonly source: S;

  public abstract all(): Superposition<Regions, E | RegionError>;

  public find(regionID: RegionID): Superposition<Region, DataSourceError | NoSuchElementError | RegionError> {
    return this.all().map<Region, DataSourceError | RegionError | UnscharferelationError>((regions: Regions) => {
      const region: Nullable<Region> = regions.find((r: Region) => {
        return r.getRegionID().equals(regionID);
      });

      return Unscharferelation.maybe<Region>(region).toSuperposition();
    }).recover<Region, DataSourceError | NoSuchElementError | RegionError>((err: DataSourceError | RegionError | UnscharferelationError) => {
      if (err instanceof UnscharferelationError) {
        throw new NoSuchElementError(regionID.get().get());
      }

      throw err;
    }, RegionError, NoSuchElementError, DataSourceError);
  }

  public findByISO3166(iso3166: ISO3166): Superposition<Region, E | NoSuchElementError | RegionError> {
    return this.all().map<Region, E | RegionError | UnscharferelationError>((regions: Regions) => {
      const region: Nullable<Region> = regions.find((r: Region) => {
        return r.getISO3166().equals(iso3166);
      });

      return Unscharferelation.maybe<Region>(region).toSuperposition();
    }).recover<Region, E | NoSuchElementError | RegionError>((err: DataSourceError | RegionError | UnscharferelationError) => {
      if (err instanceof UnscharferelationError) {
        throw new NoSuchElementError(iso3166.toString());
      }

      throw err;
    }, RegionError, NoSuchElementError, DataSourceError);
  }
}
