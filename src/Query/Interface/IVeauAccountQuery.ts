import { DataSourceError } from '@jamashita/anden-error';
import { Superposition } from '@jamashita/genitore-superposition';
import { EntranceInformation } from '../../VO/EntranceInformation/EntranceInformation';
import { VeauAccountError } from '../../VO/VeauAccount/Error/VeauAccountError';
import { VeauAccount } from '../../VO/VeauAccount/VeauAccount';
import { IQuery } from './IQuery';

export interface IVeauAccountQuery<E extends DataSourceError = DataSourceError> extends IQuery<'VeauAccountQuery'> {
  readonly noun: 'VeauAccountQuery';

  find(): Superposition<VeauAccount, VeauAccountError | E>;

  findByEntranceInfo(entranceInformation: EntranceInformation): Superposition<VeauAccount, VeauAccountError | E>;
}
