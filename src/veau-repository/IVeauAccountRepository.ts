import { VeauAccountHash } from './VeauAccountRepository';

export interface IVeauAccountRepository {

  findByAccount(account: string): Promise<VeauAccountHash>;
}
