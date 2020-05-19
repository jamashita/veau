import { inject, injectable } from 'inversify';
import { Alive, DataSourceError, Dead, Quantum, QuantumError, Superposition, UnimplementedError } from 'publikum';

import { TYPE } from '../../Container/Types';
import { LocaleError } from '../../VO/Locale/Error/LocaleError';
import { NoSuchElementError } from '../Error/NoSuchElementError';
import { RegionError } from '../../VO/Region/Error/RegionError';
import { RegionsError } from '../../VO/Region/Error/RegionsError';
import { Locale } from '../../VO/Locale/Locale';
import { ISO3166 } from '../../VO/Region/ISO3166';
import { Region } from '../../VO/Region/Region';
import { RegionID } from '../../VO/Region/RegionID';
import { Regions } from '../../VO/Region/Regions';
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
    const superposition: Superposition<Locale, LocaleError | DataSourceError> = await this.localeVaultQuery.all();

    return superposition.match<Regions, RegionsError | DataSourceError>(
      (locale: Locale) => {
        return Alive.of<Regions, DataSourceError>(locale.getRegions());
      },
      (err: LocaleError | DataSourceError) => {
        if (err instanceof LocaleError) {
          return Dead.of<Regions, RegionsError>(new RegionsError('RegionQuery.all()', err));
        }

        return Dead.of<Regions, DataSourceError>(err);
      }
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public find(regionID: RegionID): Promise<Superposition<Region, RegionError | NoSuchElementError | DataSourceError>> {
    return Promise.reject<Superposition<Region, RegionError | NoSuchElementError | DataSourceError>>(
      new UnimplementedError()
    );
  }

  public async findByISO3166(
    iso3166: ISO3166
  ): Promise<Superposition<Region, RegionError | NoSuchElementError | DataSourceError>> {
    const superposition: Superposition<Regions, RegionsError | DataSourceError> = await this.all();

    return superposition.match<Region, RegionError | NoSuchElementError | DataSourceError>(
      (regions: Regions) => {
        const quantum: Quantum<Region> = regions.find((region: Region) => {
          return region.getISO3166().equals(iso3166);
        });

        return quantum.toSuperposition().match<Region, NoSuchElementError | DataSourceError>(
          (region: Region, self: Alive<Region, QuantumError>) => {
            return self.transpose<DataSourceError>();
          },
          () => {
            return Dead.of<Region, NoSuchElementError>(new NoSuchElementError(iso3166.get()));
          }
        );
      },
      (err: RegionsError | DataSourceError) => {
        if (err instanceof RegionsError) {
          return Dead.of<Region, RegionError>(new RegionError('RegionQuery.findByISO3166()', err));
        }

        return Dead.of<Region, DataSourceError>(err);
      }
    );
  }
}
