import { UnimplementedError } from '@jamashita/anden-error';
import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore';
import { VeauAccountError } from '../../../domain/vo/VeauAccount/error/VeauAccountError';
import { VeauAccount } from '../../../domain/vo/VeauAccount/VeauAccount';
import { IVeauAccountQuery } from '../interface/IVeauAccountQuery';
import { IMockQuery } from './interface/IMockQuery';

export class MockVeauAccountQuery implements IVeauAccountQuery, IMockQuery {
  public readonly noun: 'VeauAccountQuery' = 'VeauAccountQuery';
  public readonly source: 'Mock' = 'Mock';

  public find(): Superposition<VeauAccount, DataSourceError | VeauAccountError> {
    throw new UnimplementedError();
  }

  public findByEntranceInfo(): Superposition<VeauAccount, DataSourceError | VeauAccountError> {
    throw new UnimplementedError();
  }
}
