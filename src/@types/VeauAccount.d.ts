import { VeauAccount } from '../VO/VeauAccount/VeauAccount';

declare module 'express' {
  export interface Response {
    locals: {
      account: VeauAccount;
    };
  }
}
