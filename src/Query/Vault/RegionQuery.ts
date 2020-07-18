import { inject, injectable } from 'inversify';

import { DataSourceError } from '@jamashita/publikum-error';
import { Superposition, Unscharferelation, UnscharferelationError } from '@jamashita/publikum-monad';
import { Nullable } from '@jamashita/publikum-type';

import { Type } from '../../Container/Types';
import { LocaleError } from '../../VO/Locale/Error/LocaleError';
import { Locale } from '../../VO/Locale/Locale';
import { RegionError } from '../../VO/Region/Error/RegionError';
import { RegionsError } from '../../VO/Region/Error/RegionsError';
import { ISO3166 } from '../../VO/Region/ISO3166';
import { Region } from '../../VO/Region/Region';
import { RegionID } from '../../VO/Region/RegionID';
import { Regions } from '../../VO/Region/Regions';
import { NoSuchElementError } from '../Error/NoSuchElementError';
import { ILocaleQuery } from '../Interface/ILocaleQuery';
import { IRegionQuery } from '../Interface/IRegionQuery';
import { IVaultQuery } from './Interface/IVaultQuery';

@injectable()
export class RegionQuery implements IRegionQuery, IVaultQuery {
  public readonly noun: 'RegionQuery' = 'RegionQuery';
  public readonly source: 'Vault' = 'Vault';
  private readonly localeVaultQuery: ILocaleQuery;

  public constructor(@inject(Type.LocaleVaultQuery) localeVaultQuery: ILocaleQuery) {
    this.localeVaultQuery = localeVaultQuery;
  }

  public all(): Superposition<Regions, RegionsError | DataSourceError> {
    return this.localeVaultQuery
      .all()
      .map<Regions, LocaleError | DataSourceError>((locale: Locale) => {
        return locale.getRegions();
      })
      .recover<Regions, RegionsError | DataSourceError>(
        (err: LocaleError | DataSourceError) => {
          if (err instanceof LocaleError) {
            throw new RegionsError('RegionQuery.all()', err);
          }

          throw err;
        },
        RegionsError,
        DataSourceError
      );
  }

  public find(regionID: RegionID): Superposition<Region, RegionError | NoSuchElementError | DataSourceError> {
    return this.all()
      .map<Region, RegionsError | DataSourceError | UnscharferelationError>((regions: Regions) => {
        const region: Nullable<Region> = regions.find((r: Region) => {
          return r.getRegionID().equals(regionID);
        });

        return Unscharferelation.maybe<Region>(region).toSuperposition();
      })
      .recover<Region, RegionError | NoSuchElementError | DataSourceError>(
        (err: RegionsError | DataSourceError | UnscharferelationError) => {
          if (err instanceof RegionsError) {
            throw new RegionError('RegionQuery.findByISO3166()', err);
          }
          if (err instanceof UnscharferelationError) {
            throw new NoSuchElementError(regionID.get().get());
          }

          throw err;
        },
        RegionError,
        NoSuchElementError,
        DataSourceError
      );
  }

  public findByISO3166(iso3166: ISO3166): Superposition<Region, RegionError | NoSuchElementError | DataSourceError> {
    return this.all()
      .map<Region, RegionsError | DataSourceError | UnscharferelationError>((regions: Regions) => {
        const region: Nullable<Region> = regions.find((r: Region) => {
          return r.getISO3166().equals(iso3166);
        });

        return Unscharferelation.maybe<Region>(region).toSuperposition();
      })
      .recover<Region, RegionError | NoSuchElementError | DataSourceError>(
        (err: RegionsError | DataSourceError | UnscharferelationError) => {
          if (err instanceof RegionsError) {
            throw new RegionError('RegionQuery.findByISO3166()', err);
          }
          if (err instanceof UnscharferelationError) {
            throw new NoSuchElementError(iso3166.get());
          }

          throw err;
        },
        RegionError,
        NoSuchElementError,
        DataSourceError
      );
  }
}
