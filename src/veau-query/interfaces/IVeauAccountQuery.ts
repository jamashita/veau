import { VeauAccountHash } from '../VeauAccountQuery';

export interface IVeauAccountQuery {

  findByAccount(account: string): Promise<VeauAccountHash>;
}
