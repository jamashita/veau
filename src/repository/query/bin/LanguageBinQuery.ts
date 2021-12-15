import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore-superposition';
import { inject, injectable } from 'inversify';
import { Type } from '../../../container/Types.js';
import { LanguageError } from '../../../domain/vo/Language/error/LanguageError.js';
import { Languages } from '../../../domain/vo/Language/Languages.js';
import { LocaleError } from '../../../domain/vo/Locale/error/LocaleError.js';
import { Locale } from '../../../domain/vo/Locale/Locale.js';
import { ALanguageQuery } from '../ALanguageQuery.js';
import { ILanguageQuery } from '../ILanguageQuery.js';
import { ILocaleQuery } from '../ILocaleQuery.js';
import { IBinQuery } from './IBinQuery.js';

@injectable()
export class LanguageBinQuery extends ALanguageQuery<DataSourceError, 'Bin'> implements ILanguageQuery, IBinQuery {
  public override readonly noun: 'LanguageQuery' = 'LanguageQuery';
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
