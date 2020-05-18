import { ISO3166 } from '../ISO3166';

export class MockISO3166 extends ISO3166 {
  public constructor(iso3166: string = '') {
    super(iso3166);
  }
}
