import { Locales } from '../LocaleUsecase';

export interface ILocaleUsecase {

  all(): Promise<Locales>;

  deleteCache(): Promise<any>;
}
