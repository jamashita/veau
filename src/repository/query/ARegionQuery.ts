import { Kind, Nullable } from '@jamashita/anden-type';
import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore-superposition';
import { injectable } from 'inversify';
import { RegionError } from '../../../domain/vo/Region/error/RegionError.js';
import { ISO3166 } from '../../../domain/vo/Region/ISO3166.js';
import { Region } from '../../../domain/vo/Region/Region.js';
import { RegionID } from '../../../domain/vo/Region/RegionID.js';
import { Regions } from '../../../domain/vo/Region/Regions.js';
import { NoSuchElementError } from '../error/NoSuchElementError.js';
import { IRegionQuery } from '../IRegionQuery.js';

@injectable()
export abstract class ARegionQuery<E extends DataSourceError = DataSourceError, S extends string = string> implements IRegionQuery<E> {
  public readonly noun: 'RegionQuery' = 'RegionQuery';
  public abstract readonly source: S;

  public abstract all(): Superposition<Regions, E | RegionError>;

  public find(regionID: RegionID): Superposition<Region, E | NoSuchElementError | RegionError> {
    return this.all().map<Region, E | NoSuchElementError | RegionError>((regions: Regions) => {
      const region: Nullable<Region> = regions.find((r: Region) => {
        return r.getRegionID().equals(regionID);
      });

      if (Kind.isNull(region)) {
        return Superposition.dead<Region, NoSuchElementError>(new NoSuchElementError(regionID.get().get()));
      }

      return Superposition.alive<Region, RegionError>(region);
    }, RegionError, NoSuchElementError, DataSourceError);
  }

  public findByISO3166(iso3166: ISO3166): Superposition<Region, E | NoSuchElementError | RegionError> {
    return this.all().map<Region, E | NoSuchElementError | RegionError>((regions: Regions) => {
      const region: Nullable<Region> = regions.find((r: Region) => {
        return r.getISO3166().equals(iso3166);
      });

      if (Kind.isNull(region)) {
        return Superposition.dead<Region, NoSuchElementError>(new NoSuchElementError(iso3166.get()));
      }

      return Superposition.alive<Region, RegionError>(region);
    }, RegionError, NoSuchElementError, DataSourceError);
  }
}
