import { inject, injectable } from 'inversify';

import { DataSourceError, UnimplementedError } from '@jamashita/publikum-error';
import { Alive, Dead, Superposition } from '@jamashita/publikum-monad';
import { IMySQL } from '@jamashita/publikum-mysql';

import { Type } from '../../Container/Types';
import { Stats } from '../../Entity/Stats/Stats';
import { StatsUpdateFactory } from '../../Factory/StatsUpdateFactory';
import { StatsUpdateTransaction } from '../../Transaction/StatsUpdateTransaction';
import { StatsID } from '../../VO/StatsOutline/StatsID';
import { VeauAccountID } from '../../VO/VeauAccount/VeauAccountID';
import { IStatsCommand } from '../Interface/IStatsCommand';
import { IKernelCommand } from './Interface/IKernelCommand';

@injectable()
export class StatsCommand implements IStatsCommand, IKernelCommand {
  public readonly noun: 'StatsCommand' = 'StatsCommand';
  public readonly source: 'Kernel' = 'Kernel';
  private readonly mysql: IMySQL;

  public constructor(@inject(Type.MySQL) mysql: IMySQL) {
    this.mysql = mysql;
  }

  public async create(stats: Stats, veauAccountID: VeauAccountID): Promise<Superposition<unknown, DataSourceError>> {
    const statsUpdateTransaction: StatsUpdateTransaction = new StatsUpdateTransaction(
      stats,
      veauAccountID,
      new StatsUpdateFactory()
    );

    const superposition: Superposition<unknown, DataSourceError> = await this.mysql.transact<
      Superposition<unknown, DataSourceError>
    >(statsUpdateTransaction);

    return superposition.transform<void, DataSourceError>(
      () => {
        return Alive.of<DataSourceError>();
      },
      (err: DataSourceError, self: Dead<unknown, DataSourceError>) => {
        return self.transpose<void>();
      }
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public deleteByStatsID(statsID: StatsID): Promise<Superposition<unknown, DataSourceError>> {
    return Promise.reject<Superposition<unknown, DataSourceError>>(new UnimplementedError());
  }
}
