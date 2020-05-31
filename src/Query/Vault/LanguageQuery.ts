import { inject, injectable } from 'inversify';

import { DataSourceError, UnimplementedError } from '@jamashita/publikum-error';
import { Alive, Dead, Quantum, QuantumError, Superposition } from '@jamashita/publikum-monad';

import { Type } from '../../Container/Types';
import { LanguageError } from '../../VO/Language/Error/LanguageError';
import { LanguagesError } from '../../VO/Language/Error/LanguagesError';
import { ISO639 } from '../../VO/Language/ISO639';
import { Language } from '../../VO/Language/Language';
import { LanguageID } from '../../VO/Language/LanguageID';
import { Languages } from '../../VO/Language/Languages';
import { LocaleError } from '../../VO/Locale/Error/LocaleError';
import { Locale } from '../../VO/Locale/Locale';
import { NoSuchElementError } from '../Error/NoSuchElementError';
import { ILanguageQuery } from '../Interface/ILanguageQuery';
import { ILocaleQuery } from '../Interface/ILocaleQuery';
import { IVaultQuery } from './Interface/IVaultQuery';

@injectable()
export class LanguageQuery implements ILanguageQuery, IVaultQuery {
  public readonly noun: 'LanguageQuery' = 'LanguageQuery';
  public readonly source: 'Vault' = 'Vault';
  private readonly localeVaultQuery: ILocaleQuery;

  public constructor(@inject(Type.LocaleVaultQuery) localeVaultQuery: ILocaleQuery) {
    this.localeVaultQuery = localeVaultQuery;
  }

  public async all(): Promise<Superposition<Languages, LanguagesError | DataSourceError>> {
    const superposition: Superposition<Locale, LocaleError | DataSourceError> = await this.localeVaultQuery.all();

    return superposition.match<Languages, LanguagesError | DataSourceError>(
      (locale: Locale) => {
        return Alive.of<Languages, DataSourceError>(locale.getLanguages());
      },
      (err: LocaleError | DataSourceError) => {
        if (err instanceof LocaleError) {
          return Dead.of<Languages, LanguagesError>(new LanguagesError('LanguageQuery.all()', err));
        }

        return Dead.of<Languages, DataSourceError>(err);
      }
    );
  }

  public find(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    languageID: LanguageID
  ): Promise<Superposition<Language, LanguageError | NoSuchElementError | DataSourceError>> {
    return Promise.reject<Superposition<Language, LanguageError | NoSuchElementError | DataSourceError>>(
      new UnimplementedError()
    );
  }

  public async findByISO639(
    iso639: ISO639
  ): Promise<Superposition<Language, LanguageError | NoSuchElementError | DataSourceError>> {
    const superposition: Superposition<Languages, LanguagesError | DataSourceError> = await this.all();

    return superposition.match<Language, LanguageError | NoSuchElementError | DataSourceError>(
      (languages: Languages) => {
        const quantum: Quantum<Language> = languages.find((language: Language) => {
          return language.getISO639().equals(iso639);
        });

        return quantum.toSuperposition().match<Language, NoSuchElementError | DataSourceError>(
          (language: Language, self: Alive<Language, QuantumError>) => {
            return self.transpose<DataSourceError>();
          },
          () => {
            return Dead.of<Language, NoSuchElementError>(new NoSuchElementError(iso639.get()));
          }
        );
      },
      (err: LanguagesError | DataSourceError) => {
        if (err instanceof LanguagesError) {
          return Dead.of<Language, LanguageError>(new LanguageError('LanguageQuery.findByISO639()', err));
        }

        return Dead.of<Language, DataSourceError>(err);
      }
    );
  }
}
