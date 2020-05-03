import { inject, injectable } from 'inversify';
import { Alive, DataSourceError, Dead, Quantum, QuantumError, Superposition } from 'publikum';
import { TYPE } from '../../Container/Types';
import { NoSuchElementError } from '../../Error/NoSuchElementError';
import { RegionError } from '../../Error/RegionError';
import { RegionsError } from '../../Error/RegionsError';
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

  public async all(): Promise<Superposition<Regions, RegionsError | DataSourceError>> {
    const superposition: Superposition<Locale, DataSourceError> = await this.localeVaultQuery.all();

    return superposition.match<Regions, DataSourceError>((locale: Locale) => {
      return Alive.of<Regions, DataSourceError>(locale.getRegions());
    }, (err: DataSourceError, self: Dead<Locale, DataSourceError>) => {
      return self.transpose<Regions>();
    });
  }

  public async findByISO3166(iso3166: ISO3166): Promise<Superposition<Region, RegionError | NoSuchElementError | DataSourceError>> {
    const superposition: Superposition<Regions, RegionsError | DataSourceError> = await this.all();

    return superposition.match<Region, RegionError | NoSuchElementError | DataSourceError>((regions: Regions) => {
      const quantum: Quantum<Region> = regions.find((region: Region) => {
        return region.getISO3166().equals(iso3166);
      });

      return quantum.toSuperposition().match<Region, NoSuchElementError | DataSourceError>((region: Region, self: Alive<Region, QuantumError>) => {
        return self.transpose<DataSourceError>();
      }, () => {
        return Dead.of<Region, NoSuchElementError>(new NoSuchElementError(iso3166.get()));
      });
    }, (err: RegionsError | DataSourceError) => {
      if (err instanceof RegionsError) {
        return Dead.of<Region, RegionError>(new RegionError('RegionQuery.findByISO3166()', err));
      }

      return Dead.of<Region, DataSourceError>(err);
    });
  }
}
