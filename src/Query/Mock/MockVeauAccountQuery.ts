import { DataSourceError, Superposition, UnimplementedError } from 'publikum';

import { VeauAccountError } from '../../VO/VeauAccount/Error/VeauAccountError';
import { VeauAccount } from '../../VO/VeauAccount/VeauAccount';
import { IVeauAccountQuery } from '../Interface/IVeauAccountQuery';
import { IMockQuery } from './Interface/IMockQuery';

export class MockVeauAccountQuery implements IVeauAccountQuery, IMockQuery {
  public readonly noun: 'VeauAccountQuery' = 'VeauAccountQuery';
  public readonly source: 'Mock' = 'Mock';

  public find(): Promise<Superposition<VeauAccount, VeauAccountError | DataSourceError>> {
    return Promise.reject<Superposition<VeauAccount, VeauAccountError | DataSourceError>>(new UnimplementedError());
  }

  public findByEntranceInfo(): Promise<Superposition<VeauAccount, VeauAccountError | DataSourceError>> {
    return Promise.reject<Superposition<VeauAccount, VeauAccountError | DataSourceError>>(new UnimplementedError());
  }
}
