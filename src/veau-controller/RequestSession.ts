import express from 'express';
import { VeauAccount } from '../veau-entity/VeauAccount';

export interface RequestSession extends express.Request {
  user?: VeauAccount;
}
