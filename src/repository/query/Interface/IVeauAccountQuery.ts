import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore';
import { EntranceInformation } from '../../domain/vo/EntranceInformation/EntranceInformation';
import { VeauAccountError } from '../../domain/vo/VeauAccount/Error/VeauAccountError';
import { VeauAccount } from '../../domain/vo/VeauAccount/VeauAccount';
import { IQuery } from './IQuery';

export interface IVeauAccountQuery<E extends DataSourceError = DataSourceError> extends IQuery<'VeauAccountQuery'> {
  readonly noun: 'VeauAccountQuery';

  find(): Superposition<VeauAccount, E | VeauAccountError>;

  findByEntranceInfo(entranceInformation: EntranceInformation): Superposition<VeauAccount, E | VeauAccountError>;
}
