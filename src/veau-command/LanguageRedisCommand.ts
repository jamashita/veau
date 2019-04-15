import { VeauRedis } from '../veau-infrastructure/VeauRedis';
import { ILanguageCommand } from './interfaces/ILanguageCommand';

export class LanguageRedisCommand implements ILanguageCommand {
  private static REDIS_KEY: string = 'Languages';

  public static getInstance(): LanguageRedisCommand {
    return new LanguageRedisCommand();
  }

  private constructor() {
  }

  public deleteAll(): Promise<any> {
    return VeauRedis.delete(LanguageRedisCommand.REDIS_KEY);
  }
}
