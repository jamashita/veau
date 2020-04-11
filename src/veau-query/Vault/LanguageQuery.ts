import { inject, injectable } from 'inversify';
import { TYPE } from '../../veau-container/Types';
import { NoSuchElementError } from '../../veau-error/NoSuchElementError';
import { DataSourceError } from '../../veau-general/DataSourceError';
import { Optional } from '../../veau-general/Optional/Optional';
import { Failure } from '../../veau-general/Try/Failure';
import { Success } from '../../veau-general/Try/Success';
import { Try } from '../../veau-general/Try/Try';
import { ISO639 } from '../../veau-vo/ISO639';
import { Language } from '../../veau-vo/Language';
import { Languages } from '../../veau-vo/Languages';
import { Locale } from '../../veau-vo/Locale';
import { ILanguageQuery } from '../interfaces/ILanguageQuery';
import { ILocaleQuery } from '../interfaces/ILocaleQuery';
import { IVaultQuery } from '../interfaces/IVaultQuery';

@injectable()
export class LanguageQuery implements ILanguageQuery, IVaultQuery {
  public readonly noun: 'LanguageQuery' = 'LanguageQuery';
  public readonly source: 'Vault' = 'Vault';
  private readonly localeVaultQuery: ILocaleQuery;

  public constructor(@inject(TYPE.LocaleVaultQuery) localeVaultQuery: ILocaleQuery) {
    this.localeVaultQuery = localeVaultQuery;
  }

  public async all(): Promise<Try<Languages, NoSuchElementError | DataSourceError>> {
    const trial: Try<Locale, DataSourceError> = await this.localeVaultQuery.all();

    return trial.match<Try<Languages, DataSourceError>>((locale: Locale) => {
      return Success.of<Languages, DataSourceError>(locale.getLanguages());
    }, (err: DataSourceError, self: Failure<Locale, DataSourceError>) => {
      return self.transpose<Languages>();
    });
  }

  public async findByISO639(iso639: ISO639): Promise<Try<Language, NoSuchElementError | DataSourceError>> {
    const trial: Try<Languages, NoSuchElementError | DataSourceError> = await this.all();

    return trial.match<Try<Language, NoSuchElementError | DataSourceError>>((languages: Languages) => {
      const optional: Optional<Language> = languages.find((language: Language) => {
        return language.getISO639().equals(iso639);
      });

      return optional.toTry().match<Try<Language, NoSuchElementError | DataSourceError>>((language: Language) => {
        return Success.of<Language, DataSourceError>(language);
      }, () => {
        return Failure.of<Language, NoSuchElementError>(new NoSuchElementError(iso639.toString()));
      });
    }, (err: NoSuchElementError | DataSourceError, self: Failure<Languages, NoSuchElementError | DataSourceError>) => {
      return self.transpose<Language>();
    });
  }
}
