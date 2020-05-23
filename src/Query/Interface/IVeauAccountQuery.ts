import { DataSourceError, Superposition } from 'publikum';

import { EntranceInformation } from '../../VO/EntranceInformation/EntranceInformation';
import { VeauAccountError } from '../../VO/VeauAccount/Error/VeauAccountError';
import { VeauAccount } from '../../VO/VeauAccount/VeauAccount';
import { IQuery } from './IQuery';

export interface IVeauAccountQuery extends IQuery {
  readonly noun: 'VeauAccountQuery';

  find(): Promise<Superposition<VeauAccount, VeauAccountError | DataSourceError>>;

  findByEntranceInfo(
    entranceInformation: EntranceInformation
  ): Promise<Superposition<VeauAccount, VeauAccountError | DataSourceError>>;
}
