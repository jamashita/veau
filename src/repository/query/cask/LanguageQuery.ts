import { UnimplementedError } from '@jamashita/anden-error';
import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore';
import { inject, injectable } from 'inversify';
import { Type } from '../../../container/Types';
import { LanguageError } from '../../../domain/vo/Language/error/LanguageError';
import { ISO639 } from '../../../domain/vo/Language/ISO639';
import { Language } from '../../../domain/vo/Language/Language';
import { LanguageID } from '../../../domain/vo/Language/LanguageID';
import { Languages } from '../../../domain/vo/Language/Languages';
import { ILanguageCommand } from '../../command/interface/ILanguageCommand';
import { LanguageQueryFindByISO639 } from '../abstract/LanguageQueryFindByISO639';
import { NoSuchElementError } from '../error/NoSuchElementError';
import { ILanguageQuery } from '../interface/ILanguageQuery';
import { ICaskQuery } from './ICaskQuery';

@injectable()
export class LanguageQuery implements ILanguageQuery, ICaskQuery {
  public readonly noun: 'LanguageQuery' = 'LanguageQuery';
  public readonly source: 'Cask' = 'Cask';
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

  public all(): Superposition<Languages, DataSourceError | LanguageError> {
    return this.redisQuery.all().recover<Languages, DataSourceError | LanguageError>(() => {
      return this.mysqlQuery.all().map<Languages, DataSourceError | LanguageError>((languages: Languages) => {
        return this.redisCommand.insertAll(languages).map<Languages, DataSourceError>(() => {
          return languages;
        });
      });
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public find(_languageID: LanguageID): Superposition<Language, DataSourceError | LanguageError | NoSuchElementError> {
    throw new UnimplementedError();
  }

  public findByISO639(iso639: ISO639): Superposition<Language, DataSourceError | LanguageError | NoSuchElementError> {
    return LanguageQueryFindByISO639.of(this.all()).findByISO639(iso639);
  }
}
