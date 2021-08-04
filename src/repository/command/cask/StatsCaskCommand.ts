import { UnimplementedError } from '@jamashita/anden-error';
import { IMySQL, MySQLError } from '@jamashita/catacombe-mysql';
import { Schrodinger } from '@jamashita/genitore-schrodinger';
import { Superposition } from '@jamashita/genitore-superposition';
import { inject, injectable } from 'inversify';
import { Type } from '../../../container/Types.js';
import { Stats } from '../../../domain/entity/Stats/Stats.js';
import { StatsID } from '../../../domain/vo/StatsOutline/StatsID.js';
import { VeauAccountID } from '../../../domain/vo/VeauAccount/VeauAccountID.js';
import { StatsUpdateFactory } from '../../../factory/StatsUpdateFactory.js';
import { IStatsCommand } from '../IStatsCommand.js';
import { StatsUpdateTransaction } from '../mysql/transaction/StatsUpdateTransaction.js';
import { ICaskCommand } from './ICaskCommand.js';

@injectable()
export class StatsCaskCommand implements IStatsCommand<MySQLError>, ICaskCommand {
  public readonly noun: 'StatsCommand' = 'StatsCommand';
  public readonly source: 'Cask' = 'Cask';
  private readonly mysql: IMySQL;

  public constructor(@inject(Type.MySQL) mysql: IMySQL) {
    this.mysql = mysql;
  }

  public create(stats: Stats, veauAccountID: VeauAccountID): Superposition<unknown, MySQLError> {
    const statsUpdateTransaction: StatsUpdateTransaction = new StatsUpdateTransaction(
      stats,
      veauAccountID,
      new StatsUpdateFactory()
    );

    return Superposition.playground<unknown, MySQLError>(async () => {
      const schrodinger: Schrodinger<unknown, MySQLError> = await this.mysql.transact<Schrodinger<unknown, MySQLError>>(
        statsUpdateTransaction
      );

      return schrodinger.get();
    }, MySQLError);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public deleteByStatsID(_statsID: StatsID): Superposition<unknown, MySQLError> {
    throw new UnimplementedError();
  }
}
