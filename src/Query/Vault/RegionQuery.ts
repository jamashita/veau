import { inject, injectable } from 'inversify';
import { Alive, DataSourceError, Dead, Quantum, Superposition } from 'publikum';
import { TYPE } from '../../Container/Types';
import { NoSuchElementError } from '../../Error/NoSuchElementError';
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

  public async all(): Promise<Superposition<Regions, NoSuchElementError | DataSourceError>> {
    const superposition: Superposition<Locale, DataSourceError> = await this.localeVaultQuery.all();

    return superposition.match<Regions, DataSourceError>((locale: Locale) => {
      return Alive.of<Regions, DataSourceError>(locale.getRegions());
    }, (err: DataSourceError, self: Dead<Locale, DataSourceError>) => {
      return self.transpose<Regions>();
    });
  }

  public async findByISO3166(iso3166: ISO3166): Promise<Superposition<Region, NoSuchElementError | DataSourceError>> {
    const superposition: Superposition<Regions, NoSuchElementError | DataSourceError> = await this.all();

    return superposition.match<Region, NoSuchElementError | DataSourceError>((regions: Regions) => {
      const quantum: Quantum<Region> = regions.find((region: Region) => {
        return region.getISO3166().equals(iso3166);
      });

      return quantum.toSuperposition().match<Region, NoSuchElementError | DataSourceError>((region: Region) => {
        return Alive.of<Region, DataSourceError>(region);
      }, () => {
        return Dead.of<Region, NoSuchElementError>(new NoSuchElementError(iso3166.get()));
      });
    }, (err: NoSuchElementError | DataSourceError, self: Dead<Regions, NoSuchElementError | DataSourceError>) => {
      return self.transpose<Region>();
    });
  }
}
