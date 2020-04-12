import { VeauAccount } from '../VO/VeauAccount';

declare module 'express' {
  export interface Response {
    locals: {
      account: VeauAccount;
    };
  }
}
