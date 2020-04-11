import { AsOf } from '../AsOf';
import moment from 'moment';

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
    super(moment.utc(`${year}-${month}-${day}`, FORMAT));
  }
}
