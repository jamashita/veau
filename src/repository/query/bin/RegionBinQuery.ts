import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore';
import { inject, injectable } from 'inversify';
import { Type } from '../../../container/Types';
import { LocaleError } from '../../../domain/vo/Locale/error/LocaleError';
import { Locale } from '../../../domain/vo/Locale/Locale';
import { RegionError } from '../../../domain/vo/Region/error/RegionError';
import { Regions } from '../../../domain/vo/Region/Regions';
import { ARegionQuery } from '../abstract/ARegionQuery';
import { ILocaleQuery } from '../interface/ILocaleQuery';
import { IRegionQuery } from '../interface/IRegionQuery';
import { IBinQuery } from './IBinQuery';

@injectable()
export class RegionBinQuery extends ARegionQuery<DataSourceError, 'Bin'> implements IRegionQuery, IBinQuery {
  public readonly noun: 'RegionQuery' = 'RegionQuery';
  public readonly source: 'Bin' = 'Bin';
  private readonly localeQuery: ILocaleQuery;

  public constructor(@inject(Type.LocaleBinQuery) localeBinQuery: ILocaleQuery) {
    super();
    this.localeQuery = localeBinQuery;
  }

  public all(): Superposition<Regions, DataSourceError | RegionError> {
    return this.localeQuery.all().map<Regions, DataSourceError | LocaleError>((locale: Locale) => {
      return locale.getRegions();
    }).recover<Regions, DataSourceError | RegionError>((err: DataSourceError | LocaleError) => {
      if (err instanceof LocaleError) {
        throw new RegionError('RegionBinQuery.all()', err);
      }

      throw err;
    }, RegionError, DataSourceError);
  }
}
