import { VeauAccount } from '../veau-entity/VeauAccount';

declare global {
  namespace Express {
    interface Request {
      // @ts-ignore
      user: VeauAccount;
    }
  }
}
