import { Nullable } from '@jamashita/anden-type';
import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition, Unscharferelation, UnscharferelationError } from '@jamashita/genitore';
import { RegionError } from '../../../domain/vo/Region/error/RegionError';
import { ISO3166 } from '../../../domain/vo/Region/ISO3166';
import { Region } from '../../../domain/vo/Region/Region';
import { Regions } from '../../../domain/vo/Region/Regions';
import { NoSuchElementError } from '../error/NoSuchElementError';

export class RegionQueryFindByISO3166<E extends DataSourceError = DataSourceError> {
  private readonly all: Superposition<Regions, E | RegionError>;

  public static of<ET extends DataSourceError = DataSourceError>(all: Superposition<Regions, ET | RegionError>): RegionQueryFindByISO3166<ET> {
    return new RegionQueryFindByISO3166(all);
  }

  protected constructor(all: Superposition<Regions, E | RegionError>) {
    this.all = all;
  }

  public findByISO3166(iso3166: ISO3166): Superposition<Region, E | NoSuchElementError | RegionError> {
    return this.all.map<Region, E | RegionError | UnscharferelationError>((regions: Regions) => {
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
