import { inject, injectable } from 'inversify';
import { TYPE } from '../../Container/Types';
import { NoSuchElementError } from '../../Error/NoSuchElementError';
import { DataSourceError } from '../../General/DataSourceError';
import { Quantum } from '../../General/Quantum/Quantum';
import { Failure } from '../../General/Superposition/Failure';
import { Success } from '../../General/Superposition/Success';
import { Superposition } from '../../General/Superposition/Superposition';
import { ISO639 } from '../../VO/ISO639';
import { Language } from '../../VO/Language';
import { Languages } from '../../VO/Languages';
import { Locale } from '../../VO/Locale';
import { ILanguageQuery } from '../Interface/ILanguageQuery';
import { ILocaleQuery } from '../Interface/ILocaleQuery';
import { IVaultQuery } from '../Interface/IVaultQuery';

@injectable()
export class LanguageQuery implements ILanguageQuery, IVaultQuery {
  public readonly noun: 'LanguageQuery' = 'LanguageQuery';
  public readonly source: 'Vault' = 'Vault';
  private readonly localeVaultQuery: ILocaleQuery;

  public constructor(@inject(TYPE.LocaleVaultQuery) localeVaultQuery: ILocaleQuery) {
    this.localeVaultQuery = localeVaultQuery;
  }

  public async all(): Promise<Superposition<Languages, NoSuchElementError | DataSourceError>> {
    const superposition: Superposition<Locale, DataSourceError> = await this.localeVaultQuery.all();

    return superposition.match<Languages, DataSourceError>((locale: Locale) => {
      return Success.of<Languages, DataSourceError>(locale.getLanguages());
    }, (err: DataSourceError, self: Failure<Locale, DataSourceError>) => {
      return self.transpose<Languages>();
    });
  }

  public async findByISO639(iso639: ISO639): Promise<Superposition<Language, NoSuchElementError | DataSourceError>> {
    const superposition: Superposition<Languages, NoSuchElementError | DataSourceError> = await this.all();

    return superposition.match<Language, NoSuchElementError | DataSourceError>((languages: Languages) => {
      const quantum: Quantum<Language> = languages.find((language: Language) => {
        return language.getISO639().equals(iso639);
      });

      return quantum.toSuperposition().match<Language, NoSuchElementError | DataSourceError>((language: Language) => {
        return Success.of<Language, DataSourceError>(language);
      }, () => {
        return Failure.of<Language, NoSuchElementError>(new NoSuchElementError(iso639.get()));
      });
    }, (err: NoSuchElementError | DataSourceError, self: Failure<Languages, NoSuchElementError | DataSourceError>) => {
      return self.transpose<Language>();
    });
  }
}
