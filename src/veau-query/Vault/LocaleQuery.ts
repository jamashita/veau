import { inject, injectable } from 'inversify';
import { ILocaleCommand } from '../../veau-command/interfaces/ILocaleCommand';
import { TYPE } from '../../veau-container/Types';
import { NoSuchElementError } from '../../veau-error/NoSuchElementError';
import { DataSourceError } from '../../veau-general/DataSourceError';
import { Failure } from '../../veau-general/Try/Failure';
import { Success } from '../../veau-general/Try/Success';
import { Try } from '../../veau-general/Try/Try';
import { ISO3166 } from '../../veau-vo/ISO3166';
import { ISO639 } from '../../veau-vo/ISO639';
import { Language } from '../../veau-vo/Language';
import { Locale } from '../../veau-vo/Locale';
import { Region } from '../../veau-vo/Region';
import { ILocaleQuery } from '../interfaces/ILocaleQuery';
import { IVaultQuery } from '../interfaces/IVaultQuery';

@injectable()
export class LocaleQuery implements ILocaleQuery, IVaultQuery {
  public readonly noun: 'LocaleQuery' = 'LocaleQuery';
  public readonly source: 'Vault' = 'Vault';
  private localeAJAXQuery: ILocaleQuery;
  private localeHeapQuery: ILocaleQuery;
  private localeCommand: ILocaleCommand;

  public constructor(@inject(TYPE.LocaleAJAXQuery) localeAJAXQuery: ILocaleQuery,
    @inject(TYPE.LocaleHeapQuery) localeHeapQuery: ILocaleQuery,
    @inject(TYPE.LocaleHeapCommand) localeCommand: ILocaleCommand) {
    this.localeAJAXQuery = localeAJAXQuery;
    this.localeHeapQuery = localeHeapQuery;
    this.localeCommand = localeCommand;
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

  public async all(): Promise<Try<Locale, DataSourceError>> {
    const trial1: Try<Locale, DataSourceError> = await this.localeHeapQuery.all();

    return trial1.match<Promise<Try<Locale, DataSourceError>>>((locale: Locale) => {
      return Promise.resolve<Success<Locale, DataSourceError>>(Success.of<Locale, DataSourceError>(locale));
    }, async () => {
      const trial2: Try<Locale, DataSourceError> = await this.localeAJAXQuery.all();

      return trial2.match<Promise<Try<Locale, DataSourceError>>>(async (locale: Locale) => {
        const trial3: Try<void, DataSourceError> =await this.localeCommand.create(locale);

        return trial3.match<Try<Locale, DataSourceError>>(() => {
          return Success.of<Locale, DataSourceError>(locale);
        }, (err: DataSourceError) => {
          return Failure.of<Locale, DataSourceError>(err);
        });
      }, (err: DataSourceError) => {
        return Promise.resolve<Failure<Locale, DataSourceError>>(Failure.of<Locale, DataSourceError>(err));
      });
    });
  }
}
