import moment from 'moment';
import { AsOf } from '../AsOf';

type AsOfArgs = Partial<Readonly<{
  year: number;
  month: number;
  day: number;
}>>;

const FORMAT: string = 'YYYY-MM-DD';

export class MockAsOf extends AsOf {

  public constructor({
    year = 2000,
    month = 1,
    day = 1
  }: AsOfArgs = {}) {
    super(moment.utc(`${year.toString().padStart(2, '0')}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`, FORMAT));
  }
}
