import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { UpdatedAt } from '../UpdatedAt';

dayjs.extend(utc);

type UpdatedAtArgs = Partial<Readonly<{
  year: number;
  month: number;
  day: number;
}>>;

const FORMAT: string = 'YYYY-MM-DD HH:mm:ss';

export class MockUpdatedAt extends UpdatedAt {

  public constructor({
    year = 2000,
    month = 1,
    day = 2
  }: UpdatedAtArgs = {}) {
    super(dayjs.utc(`${year.toString().padStart(2, '0')}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} 01:02:03`, FORMAT));
  }
}
