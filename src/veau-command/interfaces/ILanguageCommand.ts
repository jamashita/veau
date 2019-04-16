import { Language } from '../../veau-vo/Language';

export interface ILanguageCommand {

  insertAll(languages: Array<Language>): Promise<any>;

  deleteAll(): Promise<any>;
}
