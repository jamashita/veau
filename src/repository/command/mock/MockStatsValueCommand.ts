import { UnimplementedError } from '@jamashita/anden-error';
import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore-superposition';
import { IStatsValueCommand } from '../IStatsValueCommand.js';
import { IMockCommand } from './IMockCommand.js';

export class MockStatsValueCommand<E extends DataSourceError = DataSourceError> implements IStatsValueCommand<E>, IMockCommand {
  public readonly noun: 'StatsValueCommand' = 'StatsValueCommand';
  public readonly source: 'Mock' = 'Mock';

  public create(): Superposition<void, E> {
    throw new UnimplementedError();
  }

  public deleteByStatsID(): Superposition<void, E> {
    throw new UnimplementedError();
  }
}
