import { inject, injectable } from 'inversify';

import { DataSourceError, UnimplementedError } from '@jamashita/publikum-error';
import { Superposition, Unscharferelation, UnscharferelationError } from '@jamashita/publikum-monad';
import { Nullable } from '@jamashita/publikum-type';

import { ILanguageCommand } from '../../Command/Interface/ILanguageCommand';
import { Type } from '../../Container/Types';
import { LanguageError } from '../../VO/Language/Error/LanguageError';
import { LanguagesError } from '../../VO/Language/Error/LanguagesError';
import { ISO639 } from '../../VO/Language/ISO639';
import { Language } from '../../VO/Language/Language';
import { LanguageID } from '../../VO/Language/LanguageID';
import { Languages } from '../../VO/Language/Languages';
import { NoSuchElementError } from '../Error/NoSuchElementError';
import { ILanguageQuery } from '../Interface/ILanguageQuery';
import { IKernelQuery } from './Interface/IKernelQuery';

@injectable()
export class LanguageQuery implements ILanguageQuery, IKernelQuery {
  public readonly noun: 'LanguageQuery' = 'LanguageQuery';
  public readonly source: 'Kernel' = 'Kernel';
  private readonly languageMySQLQuery: ILanguageQuery;
  private readonly languageRedisQuery: ILanguageQuery;
  private readonly languageRedisCommand: ILanguageCommand;

  public constructor(
    @inject(Type.LanguageMySQLQuery) languageMySQLQuery: ILanguageQuery,
    @inject(Type.LanguageRedisQuery) languageRedisQuery: ILanguageQuery,
    @inject(Type.LanguageRedisCommand) languageRedisCommand: ILanguageCommand
  ) {
    this.languageMySQLQuery = languageMySQLQuery;
    this.languageRedisQuery = languageRedisQuery;
    this.languageRedisCommand = languageRedisCommand;
  }

  public all(): Superposition<Languages, LanguagesError | DataSourceError> {
    return this.languageRedisQuery.all().recover<Languages, LanguagesError | DataSourceError>(() => {
      return this.languageMySQLQuery.all().map<Languages, LanguagesError | DataSourceError>((languages: Languages) => {
        return this.languageRedisCommand.insertAll(languages).map<Languages, DataSourceError>(() => {
          return languages;
        });
      });
    }, DataSourceError);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public find(_languageID: LanguageID): Superposition<Language, LanguageError | NoSuchElementError | DataSourceError> {
    throw new UnimplementedError();
  }

  public findByISO639(iso639: ISO639): Superposition<Language, LanguageError | NoSuchElementError | DataSourceError> {
    return this.all()
      .map<Language, LanguagesError | DataSourceError | UnscharferelationError>((languages: Languages) => {
        const language: Nullable<Language> = languages.find((l: Language) => {
          return l.getISO639().equals(iso639);
        });

        return Unscharferelation.maybe(language).toSuperposition();
      })
      .recover<Language, LanguageError | NoSuchElementError | DataSourceError>(
        (err: LanguagesError | DataSourceError | UnscharferelationError) => {
          if (err instanceof LanguagesError) {
            throw new LanguageError('LanguageQuery.findByISO639()', err);
          }
          if (err instanceof UnscharferelationError) {
            throw new NoSuchElementError(iso639.toString());
          }

          throw err;
        },
        LanguageError,
        NoSuchElementError,
        DataSourceError
      );
  }
}
