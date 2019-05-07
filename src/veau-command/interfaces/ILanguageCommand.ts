import { Language } from '@/veau-entity/Language';

export interface ILanguageCommand {

  insertAll(languages: Array<Language>): Promise<any>;

  deleteAll(): Promise<any>;
}
