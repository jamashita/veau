import * as express from 'express';
import { VeauAccount } from '@/veau-entity/VeauAccount';

export interface RequestSession extends express.Request {
  session: Express.Session;
  sessionID: string;
  user: VeauAccount;
}
