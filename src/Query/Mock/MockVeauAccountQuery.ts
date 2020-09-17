import { DataSourceError, UnimplementedError } from '@jamashita/publikum-error';
import { Superposition } from '@jamashita/publikum-monad';
import { VeauAccountError } from '../../VO/VeauAccount/Error/VeauAccountError';
import { VeauAccount } from '../../VO/VeauAccount/VeauAccount';
import { IVeauAccountQuery } from '../Interface/IVeauAccountQuery';
import { IMockQuery } from './Interface/IMockQuery';

export class MockVeauAccountQuery implements IVeauAccountQuery, IMockQuery {
  public readonly noun: 'VeauAccountQuery' = 'VeauAccountQuery';
  public readonly source: 'Mock' = 'Mock';

  public find(): Superposition<VeauAccount, VeauAccountError | DataSourceError> {
    throw new UnimplementedError();
  }

  public findByEntranceInfo(): Superposition<VeauAccount, VeauAccountError | DataSourceError> {
    throw new UnimplementedError();
  }
}
