import { VeauRedis } from '../veau-infrastructure/VeauRedis';
import { ILanguageCommand } from './interfaces/ILanguageCommand';

const REDIS_KEY: string = 'Languages';

export class LanguageCommand implements ILanguageCommand {

  public static getInstance(): LanguageCommand {
    return new LanguageCommand();
  }

  private constructor() {
  }

  public deleteAll(): Promise<boolean> {
    return VeauRedis.delete(REDIS_KEY);
  }
}
