import { Nullable } from '@jamashita/anden-type';
import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition, Unscharferelation, UnscharferelationError } from '@jamashita/genitore';
import { inject, injectable } from 'inversify';
import { Type } from '../../../container/Types';
import { LocaleError } from '../../../domain/vo/Locale/error/LocaleError';
import { Locale } from '../../../domain/vo/Locale/Locale';
import { RegionError } from '../../../domain/vo/Region/error/RegionError';
import { ISO3166 } from '../../../domain/vo/Region/ISO3166';
import { Region } from '../../../domain/vo/Region/Region';
import { RegionID } from '../../../domain/vo/Region/RegionID';
import { Regions } from '../../../domain/vo/Region/Regions';
import { NoSuchElementError } from '../error/NoSuchElementError';
import { ILocaleQuery } from '../interface/ILocaleQuery';
import { IRegionQuery } from '../interface/IRegionQuery';
import { RegionQueryFindByISO3166 } from '../trait/RegionQueryFindByISO3166';
import { IBinQuery } from './IBinQuery';

@injectable()
export class RegionQuery implements IRegionQuery, IBinQuery {
  public readonly noun: 'RegionQuery' = 'RegionQuery';
  public readonly source: 'Bin' = 'Bin';
  private readonly localeQuery: ILocaleQuery;

  public constructor(@inject(Type.LocaleBinQuery) localeBinQuery: ILocaleQuery) {
    this.localeQuery = localeBinQuery;
  }

  public all(): Superposition<Regions, DataSourceError | RegionError> {
    return this.localeQuery.all().map<Regions, DataSourceError | LocaleError>((locale: Locale) => {
      return locale.getRegions();
    }).recover<Regions, DataSourceError | RegionError>((err: DataSourceError | LocaleError) => {
      if (err instanceof LocaleError) {
        throw new RegionError('RegionQuery.all()', err);
      }

      throw err;
    }, RegionError, DataSourceError);
  }

  // TODO TRAIT
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

  public findByISO3166(iso3166: ISO3166): Superposition<Region, DataSourceError | NoSuchElementError | RegionError> {
    return RegionQueryFindByISO3166.of(this.all()).findByISO3166(iso3166);
  }
}
