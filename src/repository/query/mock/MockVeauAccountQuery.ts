import { UnimplementedError } from '@jamashita/anden-error';
import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore-superposition';
import { VeauAccountError } from '../../../domain/vo/VeauAccount/error/VeauAccountError.js';
import { VeauAccount } from '../../../domain/vo/VeauAccount/VeauAccount.js';
import { IVeauAccountQuery } from '../IVeauAccountQuery.js';
import { IMockQuery } from './IMockQuery.js';

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
