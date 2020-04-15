import dayjs from 'dayjs';
import minMax from 'dayjs/plugin/minMax';
import utc from 'dayjs/plugin/utc';
import { ValueObject } from '../ValueObject';
import { ZeitError } from './ZeitError';

dayjs.extend(utc);
dayjs.extend(minMax);

export type ZeitUnitType = 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';

export class Zeit extends ValueObject {
  public readonly noun: 'Zeit' = 'Zeit';
  private readonly zeit: dayjs.Dayjs;
  private readonly format?: string;

  public static of(zeit: dayjs.Dayjs, format?: string): Zeit {
    return new Zeit(zeit, format);
  }

  public static ofString(str: string, format?: string): Zeit {
    if (Number.isNaN(Date.parse(str))) {
      throw new ZeitError(`ILLEGAL ZEIT SPECIFIED: ${str}`);
    }

    const zeit: dayjs.Dayjs = dayjs.utc(str, format);
    if (zeit.format(format) === str) {
      throw new ZeitError(`ILLEGAL ZEIT SPECIFIED: ${str}`);
    }

    return Zeit.of(zeit, format);
  }

  private constructor(zeit: dayjs.Dayjs, format?: string) {
    super();
    this.zeit = zeit;
    this.format = format;
  }

  public get(): dayjs.Dayjs {
    return this.zeit;
  }

  public getFormat(): string | undefined {
    return this.format;
  }

  public isValid(): boolean {
    return this.zeit.isValid();
  }

  public isBefore(other: Zeit): boolean {
    return this.zeit.isBefore(other.zeit);
  }

  public isAfter(other: Zeit): boolean {
    return this.zeit.isAfter(other.zeit);
  }

  public past(value: number, unit: ZeitUnitType): Zeit {
    return Zeit.of(this.zeit.subtract(value, unit));
  }

  public future(value: number, unit: ZeitUnitType): Zeit {
    return Zeit.of(this.zeit.add(value, unit));
  }

  public equals(other: Zeit): boolean {
    if (this === other) {
      return true;
    }
    if (this.format !== other.format) {
      return false;
    }

    return this.zeit.isSame(other.zeit);
  }

  public toString(): string {
    return this.zeit.format(this.format);
  }
}
