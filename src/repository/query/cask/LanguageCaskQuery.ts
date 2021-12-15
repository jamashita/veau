import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore-superposition';
import { inject, injectable } from 'inversify';
import { Type } from '../../../container/Types.js';
import { LanguageError } from '../../../domain/vo/Language/error/LanguageError.js';
import { Languages } from '../../../domain/vo/Language/Languages.js';
import { ILanguageCommand } from '../../command/ILanguageCommand.js';
import { ALanguageQuery } from '../ALanguageQuery.js';
import { ILanguageQuery } from '../ILanguageQuery.js';
import { ICaskQuery } from './ICaskQuery.js';

@injectable()
export class LanguageCaskQuery extends ALanguageQuery<DataSourceError, 'Cask'> implements ILanguageQuery, ICaskQuery {
  public override readonly noun: 'LanguageQuery' = 'LanguageQuery';
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
