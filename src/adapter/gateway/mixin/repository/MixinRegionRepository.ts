import { UnimplementedError } from '@jamashita/anden-error';
import { Kind, Nullable } from '@jamashita/anden-type';
import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Alive, Dead, Schrodinger } from '@jamashita/genitore-schrodinger';
import { ISO3166 } from '../../../../domain/Region/ISO3166';
import { Region } from '../../../../domain/Region/Region';
import { RegionError } from '../../../../domain/Region/RegionError';
import { RegionID } from '../../../../domain/Region/RegionID';
import { RegionRepository } from '../../../../domain/Region/RegionRepository';
import { Regions } from '../../../../domain/Region/Regions';
import { NoSuchElementError } from '../../../../repository/query/error/NoSuchElementError';

export class MixinRegionRepository<E extends DataSourceError = DataSourceError> implements RegionRepository<E> {
  private readonly regions: Regions;

  public constructor(regions: Regions) {
    this.regions = regions;
  }

  public all(): Promise<Schrodinger<Regions, E | RegionError>> {
    return Promise.reject(new UnimplementedError());
  }

  public createAll(): Promise<Schrodinger<unknown, E>> {
    return Promise.reject(new UnimplementedError());
  }

  public deleteAll(): Promise<Schrodinger<unknown, E>> {
    return Promise.reject(new UnimplementedError());
  }

  public find(id: RegionID): Promise<Schrodinger<Region, E | NoSuchElementError | RegionError>> {
    const region: Nullable<Region> = this.regions.find((r: Region) => {
      return r.getRegionID().equals(id);
    });

    if (Kind.isNull(region)) {
      return Promise.resolve(Dead.of(new NoSuchElementError(id.get().get())));
    }

    return Promise.resolve(Alive.of(region));
  }

  public findByISO3166(iso3166: ISO3166): Promise<Schrodinger<Region, E | NoSuchElementError | RegionError>> {
    const region: Nullable<Region> = this.regions.find((r: Region) => {
      return r.getISO3166().equals(iso3166);
    });

    if (Kind.isNull(region)) {
      return Promise.resolve(Dead.of(new NoSuchElementError(iso3166.get())));
    }

    return Promise.resolve(Alive.of(region));
  }
}
