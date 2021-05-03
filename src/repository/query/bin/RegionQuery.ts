import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore';
import { inject, injectable } from 'inversify';
import { Type } from '../../../container/Types';
import { LocaleError } from '../../../domain/vo/Locale/error/LocaleError';
import { Locale } from '../../../domain/vo/Locale/Locale';
import { RegionError } from '../../../domain/vo/Region/error/RegionError';
import { ISO3166 } from '../../../domain/vo/Region/ISO3166';
import { Region } from '../../../domain/vo/Region/Region';
import { RegionID } from '../../../domain/vo/Region/RegionID';
import { Regions } from '../../../domain/vo/Region/Regions';
import { RegionQueryFind } from '../abstract/RegionQueryFind';
import { RegionQueryFindByISO3166 } from '../abstract/RegionQueryFindByISO3166';
import { NoSuchElementError } from '../error/NoSuchElementError';
import { ILocaleQuery } from '../interface/ILocaleQuery';
import { IRegionQuery } from '../interface/IRegionQuery';
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

  public find(regionID: RegionID): Superposition<Region, DataSourceError | NoSuchElementError | RegionError> {
    return RegionQueryFind.of(this.all()).find(regionID);
  }

  public findByISO3166(iso3166: ISO3166): Superposition<Region, DataSourceError | NoSuchElementError | RegionError> {
    return RegionQueryFindByISO3166.of(this.all()).findByISO3166(iso3166);
  }
}
