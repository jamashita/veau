import { inject, injectable } from 'inversify';
import { Alive, DataSourceError, Dead, Quantum, QuantumError, Superposition, UnimplementedError } from 'publikum';
import { TYPE } from '../../Container/Types';
import { LanguageError } from '../../Error/LanguageError';
import { LanguagesError } from '../../Error/LanguagesError';
import { LocaleError } from '../../Error/LocaleError';
import { NoSuchElementError } from '../../Error/NoSuchElementError';
import { ISO639 } from '../../VO/ISO639';
import { Language } from '../../VO/Language';
import { LanguageID } from '../../VO/LanguageID';
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

  public async all(): Promise<Superposition<Languages, LanguagesError | DataSourceError>> {
    const superposition: Superposition<Locale, LocaleError | DataSourceError> = await this.localeVaultQuery.all();

    return superposition.match<Languages, LanguagesError | DataSourceError>((locale: Locale) => {
      return Alive.of<Languages, DataSourceError>(locale.getLanguages());
    }, (err: LocaleError | DataSourceError) => {
      if (err instanceof LocaleError) {
        return Dead.of<Languages, LanguagesError>(new LanguagesError('LanguageQuery.all()', err));
      }

      return Dead.of<Languages, DataSourceError>(err);
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public find(languageID: LanguageID): Promise<Superposition<Language, LanguageError | NoSuchElementError | DataSourceError>> {
    return Promise.reject <Superposition<Language, LanguageError | NoSuchElementError | DataSourceError>>(new UnimplementedError());
  }

  public async findByISO639(iso639: ISO639): Promise<Superposition<Language, LanguageError | NoSuchElementError | DataSourceError>> {
    const superposition: Superposition<Languages, LanguagesError | DataSourceError> = await this.all();

    return superposition.match<Language, LanguageError | NoSuchElementError | DataSourceError>((languages: Languages) => {
      const quantum: Quantum<Language> = languages.find((language: Language) => {
        return language.getISO639().equals(iso639);
      });

      return quantum.toSuperposition().match<Language, NoSuchElementError | DataSourceError>((language: Language, self: Alive<Language, QuantumError>) => {
        return self.transpose<DataSourceError>();
      }, () => {
        return Dead.of<Language, NoSuchElementError>(new NoSuchElementError(iso639.get()));
      });
    }, (err: LanguagesError | DataSourceError) => {
      if (err instanceof LanguagesError) {
        return Dead.of<Language, LanguageError>(new LanguageError('LanguageQuery.findByISO639()', err));
      }

      return Dead.of<Language, DataSourceError>(err);
    });
  }
}
