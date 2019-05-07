import { Language } from '../../veau-entity/Language';
import { ISO639 } from '../../veau-vo/ISO639';

export interface ILanguageQuery {

  allLanguages(): Promise<Array<Language>>;

  findByISO639(iso639: ISO639): Promise<Language>;
}
