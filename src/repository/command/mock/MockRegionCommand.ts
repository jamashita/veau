import { UnimplementedError } from '@jamashita/anden-error';
import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore';
import { IRegionCommand } from '../interface/IRegionCommand';
import { IMockCommand } from './IMockCommand';

export class MockRegionCommand<E extends DataSourceError = DataSourceError> implements IRegionCommand<E>, IMockCommand {
  public readonly noun: 'RegionCommand' = 'RegionCommand';
  public readonly source: 'Mock' = 'Mock';

  public deleteAll(): Superposition<void, E> {
    throw new UnimplementedError();
  }

  public insertAll(): Superposition<void, E> {
    throw new UnimplementedError();
  }
}
