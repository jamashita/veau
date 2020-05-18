import { DataSourceError, Superposition, UnimplementedError } from 'publikum';
import { VeauAccountError } from 'src/Error/VeauAccountError';
import { EntranceInformation } from 'src/VO/EntranceInformation';
import { VeauAccount } from 'src/VO/VeauAccount';
import { IMockQuery } from '../Interface/IMockQuery';
import { IVeauAccountQuery } from '../Interface/IVeauAccountQuery';

export class MockVeauAccountQuery implements IVeauAccountQuery, IMockQuery {
  public readonly noun: 'VeauAccountQuery' = 'VeauAccountQuery';
  public readonly source: 'Mock' = 'Mock';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public find(): Promise<Superposition<VeauAccount, VeauAccountError | DataSourceError>> {
    return Promise.reject<Superposition<VeauAccount, VeauAccountError | DataSourceError>>(new UnimplementedError());
  }

  public findByEntranceInfo(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    entranceInformation: EntranceInformation
  ): Promise<Superposition<VeauAccount, VeauAccountError | DataSourceError>> {
    return Promise.reject<Superposition<VeauAccount, VeauAccountError | DataSourceError>>(new UnimplementedError());
  }
}
