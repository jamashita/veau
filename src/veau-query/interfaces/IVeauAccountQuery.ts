import { VeauAccount } from '@/veau-entity/VeauAccount';

export type VeauAccountHash = {
  veauAccount: VeauAccount;
  hash: string;
};

export interface IVeauAccountQuery {

  findByAccount(account: string): Promise<VeauAccountHash>;
}
