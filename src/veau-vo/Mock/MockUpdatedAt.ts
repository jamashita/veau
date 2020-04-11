import { UpdatedAt } from '../UpdatedAt';
import moment from 'moment';

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
    super(moment.utc(`${year.toString().padStart(2, '0')}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} 01:02:03`, FORMAT));
  }
}
