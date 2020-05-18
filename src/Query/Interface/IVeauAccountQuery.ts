import { DataSourceError, Superposition } from 'publikum';
import { VeauAccountError } from '../../Error/VeauAccountError';
import { EntranceInformation } from '../../VO/EntranceInformation';
import { VeauAccount } from '../../VO/VeauAccount';
import { IQuery } from './IQuery';

export interface IVeauAccountQuery extends IQuery {
  readonly noun: 'VeauAccountQuery';

  find(): Promise<Superposition<VeauAccount, VeauAccountError | DataSourceError>>;

  findByEntranceInfo(
    entranceInformation: EntranceInformation
  ): Promise<Superposition<VeauAccount, VeauAccountError | DataSourceError>>;
}
