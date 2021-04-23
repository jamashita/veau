import { DataSourceError, UnimplementedError } from '@jamashita/anden-error';
import { Superposition, Unscharferelation, UnscharferelationError } from '@jamashita/genitore-superposition';
import { Nullable } from '@jamashita/anden-type';
import { inject, injectable } from 'inversify';
import { ILanguageCommand } from '../../Command/Interface/ILanguageCommand';
import { Type } from '../../Container/Types';
import { LanguageError } from '../../VO/Language/Error/LanguageError';
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
  private readonly mysqlQuery: ILanguageQuery;
  private readonly redisQuery: ILanguageQuery;
  private readonly redisCommand: ILanguageCommand;

  public constructor(
    @inject(Type.LanguageMySQLQuery) mysqlQuery: ILanguageQuery,
    @inject(Type.LanguageRedisQuery) redisQuery: ILanguageQuery,
    @inject(Type.LanguageRedisCommand) redisCommand: ILanguageCommand
  ) {
    this.mysqlQuery = mysqlQuery;
    this.redisQuery = redisQuery;
    this.redisCommand = redisCommand;
  }

  public all(): Superposition<Languages, LanguageError | DataSourceError> {
    return this.redisQuery.all().recover<Languages, LanguageError | DataSourceError>(() => {
      return this.mysqlQuery.all().map<Languages, LanguageError | DataSourceError>((languages: Languages) => {
        return this.redisCommand.insertAll(languages).map<Languages, DataSourceError>(() => {
          return languages;
        });
      });
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public find(_languageID: LanguageID): Superposition<Language, LanguageError | NoSuchElementError | DataSourceError> {
    throw new UnimplementedError();
  }

  public findByISO639(iso639: ISO639): Superposition<Language, LanguageError | NoSuchElementError | DataSourceError> {
    return this.all().map<Language, LanguageError | UnscharferelationError | DataSourceError>((languages: Languages) => {
      const language: Nullable<Language> = languages.find((l: Language) => {
        return l.getISO639().equals(iso639);
      });

      return Unscharferelation.maybe(language).toSuperposition();
    }).recover<Language, LanguageError | NoSuchElementError | DataSourceError>((err: LanguageError | UnscharferelationError | DataSourceError) => {
      if (err instanceof UnscharferelationError) {
        throw new NoSuchElementError(iso639.toString());
      }

      throw err;
    }, LanguageError, NoSuchElementError, DataSourceError);
  }
}
