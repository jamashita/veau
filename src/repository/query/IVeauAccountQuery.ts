import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore-superposition';
import { EntranceInformation } from '../../../domain/vo/EntranceInformation/EntranceInformation.js';
import { VeauAccountError } from '../../../domain/vo/VeauAccount/error/VeauAccountError.js';
import { VeauAccount } from '../../../domain/vo/VeauAccount/VeauAccount.js';
import { IQuery } from './IQuery.js';

export interface IVeauAccountQuery<E extends DataSourceError = DataSourceError> extends IQuery<'VeauAccountQuery'> {
  readonly noun: 'VeauAccountQuery';

  find(): Superposition<VeauAccount, E | VeauAccountError>;

  findByEntranceInfo(entranceInformation: EntranceInformation): Superposition<VeauAccount, E | VeauAccountError>;
}
