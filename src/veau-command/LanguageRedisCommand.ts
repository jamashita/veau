import { VeauRedis } from '../veau-infrastructure/VeauRedis';
import { ILanguageCommand } from './interfaces/ILanguageCommand';

const REDIS_KEY: string = 'Languages';

export class LanguageRedisCommand implements ILanguageCommand {

  public static getInstance(): LanguageRedisCommand {
    return new LanguageRedisCommand();
  }

  private constructor() {
  }

  public deleteAll(): Promise<any> {
    return VeauRedis.delete(REDIS_KEY);
  }
}
