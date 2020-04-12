import { inject, injectable } from 'inversify';
import { TYPE } from '../../Container/Types';
import { NoSuchElementError } from '../../Error/NoSuchElementError';
import { DataSourceError } from '../../General/DataSourceError';
import { Optional } from '../../General/Optional/Optional';
import { Failure } from '../../General/Try/Failure';
import { Success } from '../../General/Try/Success';
import { Try } from '../../General/Try/Try';
import { ISO3166 } from '../../VO/ISO3166';
import { Locale } from '../../VO/Locale';
import { Region } from '../../VO/Region';
import { Regions } from '../../VO/Regions';
import { ILocaleQuery } from '../Interface/ILocaleQuery';
import { IRegionQuery } from '../Interface/IRegionQuery';
import { IVaultQuery } from '../Interface/IVaultQuery';

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
    }, (err: DataSourceError, self: Failure<Locale, DataSourceError>) => {
      return self.transpose<Regions>();
    });
  }

  public async findByISO3166(iso3166: ISO3166): Promise<Try<Region, NoSuchElementError | DataSourceError>> {
    const trial: Try<Regions, NoSuchElementError | DataSourceError> = await this.all();

    return trial.match<Try<Region, NoSuchElementError | DataSourceError>>((regions: Regions) => {
      const optional: Optional<Region> = regions.find((region: Region) => {
        return region.getISO3166().equals(iso3166);
      });

      return optional.toTry().match<Try<Region, NoSuchElementError | DataSourceError>>((region: Region) => {
        return Success.of<Region, DataSourceError>(region);
      }, () => {
        return Failure.of<Region, NoSuchElementError>(new NoSuchElementError(iso3166.toString()));
      });
    }, (err: NoSuchElementError | DataSourceError, self: Failure<Regions, NoSuchElementError | DataSourceError>) => {
      return self.transpose<Region>();
    });
  }
}
