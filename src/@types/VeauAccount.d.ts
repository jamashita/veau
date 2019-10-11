import { VeauAccount } from '../veau-vo/VeauAccount';

declare module 'express' {
  export interface Response {
    locals: {
      account: VeauAccount;
    };
  }
}
