import { UnimplementedError } from '@jamashita/anden-error';
import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore-superposition';
import { IStatsItemCommand } from '../IStatsItemCommand.js';
import { IMockCommand } from './IMockCommand.js';

export class MockStatsItemCommand<E extends DataSourceError = DataSourceError> implements IStatsItemCommand<E>, IMockCommand {
  public readonly noun: 'StatsItemCommand' = 'StatsItemCommand';
  public readonly source: 'Mock' = 'Mock';

  public create(): Superposition<void, E> {
    throw new UnimplementedError();
  }

  public deleteByStatsID(): Superposition<void, E> {
    throw new UnimplementedError();
  }
}
