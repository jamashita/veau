import { VeauAccount } from '../veau-entity/VeauAccount';

declare module 'express' {
  export interface Response {
    locals: {
      account: VeauAccount;
    };
  }
}
