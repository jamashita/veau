import { inject, injectable } from 'inversify';
import { TYPE } from '../../veau-container/Types';
import { NoSuchElementError } from '../../veau-error/NoSuchElementError';
import { DataSourceError } from '../../veau-general/DataSourceError';
import { Failure } from '../../veau-general/Try/Failure';
import { Success } from '../../veau-general/Try/Success';
import { Try } from '../../veau-general/Try/Try';
import { Ambiguous } from '../../veau-general/Type/Value';
import { ISO3166 } from '../../veau-vo/ISO3166';
import { Locale } from '../../veau-vo/Locale';
import { Region } from '../../veau-vo/Region';
import { Regions } from '../../veau-vo/Regions';
import { ILocaleQuery } from '../interfaces/ILocaleQuery';
import { IRegionQuery } from '../interfaces/IRegionQuery';
import { IVaultQuery } from '../interfaces/IVaultQuery';

@injectable()
export class RegionQuery implements IRegionQuery, IVaultQuery {
  public readonly noun: 'RegionQuery' = 'RegionQuery';
  public readonly source: 'Vault' = 'Vault';
  private readonly localeVaultQuery: ILocaleQuery;

  public constructor(@inject(TYPE.LocaleVaultQuery) localeVaultQuery: ILocaleQuery) {
    this.localeVaultQuery = localeVaultQuery;
  }

  public async all(): Promise<Try<Regions, NoSuchElementError | DataSourceError>> {
    const trial: Try<Locale, DataSourceError> = await this.localeVaultQuery.all();

    return trial.match<Try<Regions, DataSourceError>>((locale: Locale) => {
      return Success.of<Regions, DataSourceError>(locale.getRegions());
    }, (err: DataSourceError) => {
      // TODO
      return Failure.of<Regions, DataSourceError>(err);
    });
  }

  public async findByISO3166(iso3166: ISO3166): Promise<Try<Region, NoSuchElementError | DataSourceError>> {
    const trial: Try<Regions, NoSuchElementError | DataSourceError> = await this.all();

    return trial.match<Try<Region, NoSuchElementError | DataSourceError>>((regions: Regions) => {
      const found: Ambiguous<Region> = regions.find((region: Region) => {
        return region.getISO3166().equals(iso3166);
      });

      if (found === undefined) {
        return Failure.of<Region, NoSuchElementError>(new NoSuchElementError(iso3166.toString()));
      }

      return Success.of<Region, NoSuchElementError>(found);
    }, (err: NoSuchElementError | DataSourceError) => {
      // TODO
      return Failure.of<Region, NoSuchElementError | DataSourceError>(err);
    });
  }
}
