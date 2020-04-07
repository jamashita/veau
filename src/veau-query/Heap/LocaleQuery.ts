import { inject, injectable } from 'inversify';
import { TYPE } from '../../veau-container/Types';
import { NoSuchElementError } from '../../veau-error/NoSuchElementError';
import { DataSourceError } from '../../veau-general/DataSourceError';
import { HeapError } from '../../veau-general/Heap/HeapError';
import { IHeap } from '../../veau-general/Heap/interfaces/IHeap';
import { Failure } from '../../veau-general/Try/Failure';
import { Success } from '../../veau-general/Try/Success';
import { Try } from '../../veau-general/Try/Try';
import { VAULT_LOCALE_KEY } from '../../veau-infrastructure/VeauVault';
import { ISO3166 } from '../../veau-vo/ISO3166';
import { ISO639 } from '../../veau-vo/ISO639';
import { Language } from '../../veau-vo/Language';
import { Locale } from '../../veau-vo/Locale';
import { Region } from '../../veau-vo/Region';
import { IHeapQuery } from '../interfaces/IHeapQuery';
import { ILocaleQuery } from '../interfaces/ILocaleQuery';

@injectable()
export class LocaleQuery implements ILocaleQuery, IHeapQuery {
  public readonly noun: 'LocaleQuery' = 'LocaleQuery';
  public readonly source: 'Heap' = 'Heap';
  private readonly heap: IHeap;

  public constructor(@inject(TYPE.Vault) heap: IHeap) {
    this.heap = heap;
  }

  public async findByISO639(iso639: ISO639): Promise<Try<Language, NoSuchElementError | DataSourceError>> {
    const trial: Try<Locale, DataSourceError> = await this.all();

    return trial.match<Try<Language, NoSuchElementError | DataSourceError>>((locale: Locale) => {
      const found: Language | undefined = locale.getLanguages().find((language: Language) => {
        return language.getISO639().equals(iso639);
      });

      if (found === undefined) {
        return Failure.of<Language, NoSuchElementError>(new NoSuchElementError(iso639.toString()));
      }

      return Success.of<Language, NoSuchElementError>(found);
    }, (err: DataSourceError) => {
      return Failure.of<Language, DataSourceError>(err);
    });
  }

  public async findByISO3166(iso3166: ISO3166): Promise<Try<Region, NoSuchElementError | DataSourceError>> {
    const trial: Try<Locale, DataSourceError> = await this.all();

    return trial.match<Try<Region, NoSuchElementError | DataSourceError>>((locale: Locale) => {
      const found: Region | undefined = locale.getRegions().find((region: Region) => {
        return region.getISO3166().equals(iso3166);
      });

      if (found === undefined) {
        return Failure.of<Region, NoSuchElementError>(new NoSuchElementError(iso3166.toString()));
      }

      return Success.of<Region, DataSourceError>(found);
    }, (err: DataSourceError) => {
      return Failure.of<Region, DataSourceError>(err);
    });
  }

  public all(): Promise<Try<Locale, DataSourceError>> {
    try {
      const locale: Locale = this.heap.get<Locale>(VAULT_LOCALE_KEY);

      return Promise.resolve<Success<Locale, DataSourceError>>(Success.of<Locale, DataSourceError>(locale));
    }
    catch (err) {
      if (err instanceof HeapError) {
        return Promise.resolve<Failure<Locale, HeapError>>(Failure.of<Locale, HeapError>(err));
      }

      throw err;
    }
  }
}
