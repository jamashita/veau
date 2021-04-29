import { UnimplementedError } from '@jamashita/anden-error';
import { IMySQL, MySQLError } from '@jamashita/catacombe-mysql';
import { Schrodinger, Superposition } from '@jamashita/genitore';
import { inject, injectable } from 'inversify';
import { Type } from '../../Container/Types';
import { Stats } from '../../Entity/Stats/Stats';
import { StatsUpdateFactory } from '../../Factory/StatsUpdateFactory';
import { StatsID } from '../../VO/StatsOutline/StatsID';
import { VeauAccountID } from '../../VO/VeauAccount/VeauAccountID';
import { IStatsCommand } from '../Interface/IStatsCommand';
import { StatsUpdateTransaction } from '../MySQL/Transaction/StatsUpdateTransaction';
import { IKernelCommand } from './Interface/IKernelCommand';

@injectable()
export class StatsCommand implements IStatsCommand<MySQLError>, IKernelCommand {
  public readonly noun: 'StatsCommand' = 'StatsCommand';
  public readonly source: 'Kernel' = 'Kernel';
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
