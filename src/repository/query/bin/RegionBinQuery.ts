import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore-superposition';
import { inject, injectable } from 'inversify';
import { Type } from '../../../container/Types.js';
import { LocaleError } from '../../../domain/vo/Locale/error/LocaleError.js';
import { Locale } from '../../../domain/vo/Locale/Locale.js';
import { RegionError } from '../../../domain/vo/Region/error/RegionError.js';
import { Regions } from '../../../domain/vo/Region/Regions.js';
import { ARegionQuery } from '../ARegionQuery.js';
import { ILocaleQuery } from '../ILocaleQuery.js';
import { IRegionQuery } from '../IRegionQuery.js';
import { IBinQuery } from './IBinQuery.js';

@injectable()
export class RegionBinQuery extends ARegionQuery<DataSourceError, 'Bin'> implements IRegionQuery, IBinQuery {
  public override readonly noun: 'RegionQuery' = 'RegionQuery';
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
