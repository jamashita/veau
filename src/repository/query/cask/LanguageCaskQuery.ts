import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore';
import { inject, injectable } from 'inversify';
import { Type } from '../../../container/Types';
import { LanguageError } from '../../../domain/vo/Language/error/LanguageError';
import { Languages } from '../../../domain/vo/Language/Languages';
import { ILanguageCommand } from '../../command/interface/ILanguageCommand';
import { ALanguageQuery } from '../abstract/ALanguageQuery';
import { ILanguageQuery } from '../interface/ILanguageQuery';
import { ICaskQuery } from './ICaskQuery';

@injectable()
export class LanguageCaskQuery extends ALanguageQuery<DataSourceError, 'Cask'> implements ILanguageQuery, ICaskQuery {
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
    super();
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
}
