import { VeauAccount } from '../domain/vo/VeauAccount/VeauAccount';

declare module 'express' {
  export interface Response {
    locals: {
      account: VeauAccount;
    };
  }
}
