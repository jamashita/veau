import { Nullable } from '@jamashita/anden-type';
import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition, Unscharferelation, UnscharferelationError } from '@jamashita/genitore';
import { RegionError } from '../../../domain/vo/Region/error/RegionError';
import { Region } from '../../../domain/vo/Region/Region';
import { RegionID } from '../../../domain/vo/Region/RegionID';
import { Regions } from '../../../domain/vo/Region/Regions';
import { NoSuchElementError } from '../error/NoSuchElementError';

export class RegionQueryFind {
  private readonly all: Superposition<Regions, DataSourceError | RegionError>;

  public static of(all: Superposition<Regions, DataSourceError | RegionError>): RegionQueryFind {
    return new RegionQueryFind(all);
  }

  protected constructor(all: Superposition<Regions, DataSourceError | RegionError>) {
    this.all = all;
  }

  public find(regionID: RegionID): Superposition<Region, DataSourceError | NoSuchElementError | RegionError> {
    return this.all.map<Region, DataSourceError | RegionError | UnscharferelationError>((regions: Regions) => {
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
}
