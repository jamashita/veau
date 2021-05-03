import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore';
import { inject, injectable } from 'inversify';
import { Type } from '../../../container/Types';
import { LanguageError } from '../../../domain/vo/Language/error/LanguageError';
import { Languages } from '../../../domain/vo/Language/Languages';
import { LocaleError } from '../../../domain/vo/Locale/error/LocaleError';
import { Locale } from '../../../domain/vo/Locale/Locale';
import { ALanguageQuery } from '../abstract/ALanguageQuery';
import { ILanguageQuery } from '../interface/ILanguageQuery';
import { ILocaleQuery } from '../interface/ILocaleQuery';
import { IBinQuery } from './IBinQuery';

@injectable()
export class LanguageBinQuery extends ALanguageQuery<DataSourceError, 'Bin'> implements ILanguageQuery, IBinQuery {
  public readonly noun: 'LanguageQuery' = 'LanguageQuery';
  public readonly source: 'Bin' = 'Bin';
  private readonly localeQuery: ILocaleQuery;

  public constructor(@inject(Type.LocaleBinQuery) localeQuery: ILocaleQuery) {
    super();
    this.localeQuery = localeQuery;
  }

  public all(): Superposition<Languages, DataSourceError | LanguageError> {
    return this.localeQuery.all().map<Languages, DataSourceError | LocaleError>((locale: Locale) => {
      return locale.getLanguages();
    }).recover<Languages, DataSourceError | LanguageError>((err: DataSourceError | LocaleError) => {
      if (err instanceof LocaleError) {
        throw new LanguageError('LanguageBinQuery.all()', err);
      }

      throw err;
    }, LanguageError, DataSourceError);
  }
}
