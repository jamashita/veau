import { VeauAccount } from '../src/veau-entity/VeauAccount';

declare global {
  namespace Express {
    interface Request {
      // @ts-ignore
      user: VeauAccount;
    }
  }
}
