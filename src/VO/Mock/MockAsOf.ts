import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { AsOf } from '../AsOf';

dayjs.extend(utc);

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
    super(dayjs.utc(`${year.toString().padStart(2, '0')}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`, FORMAT));
  }
}
