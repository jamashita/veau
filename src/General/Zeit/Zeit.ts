import dayjs from 'dayjs';
import minMax from 'dayjs/plugin/minMax';
import utc from 'dayjs/plugin/utc';
import { ValueObject } from '../ValueObject';

dayjs.extend(utc);
dayjs.extend(minMax);

export type ZeitUnitType = 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';

export class Zeit extends ValueObject {
  public readonly noun: 'Zeit' = 'Zeit';
  private readonly zeit: dayjs.Dayjs;
  private readonly format?: string;
  private readonly valid: boolean;

  public static of(zeit: dayjs.Dayjs, format?: string): Zeit {
    return Zeit.a(zeit, zeit.isValid(), format);
  }

  private static a(zeit: dayjs.Dayjs, valid: boolean, format?: string): Zeit {
    return new Zeit(zeit, valid, format);
  }

  public static ofString(str: string, format?: string): Zeit {
    if (format === undefined) {
      const zeit: dayjs.Dayjs = dayjs.utc(str);

      return Zeit.a(zeit, zeit.isValid(), format);
    }

    const zeit: dayjs.Dayjs = dayjs.utc(str, format);

    if (zeit.format(format) === str) {
      return Zeit.a(zeit, true, format);
    }

    return Zeit.a(zeit, false, format);
  }

  private constructor(zeit: dayjs.Dayjs, valid: boolean, format?: string) {
    super();
    this.zeit = zeit;
    this.valid = valid;
    this.format = format;
  }

  public get(): dayjs.Dayjs {
    return this.zeit;
  }

  public getFormat(): string | undefined {
    return this.format;
  }

  public isValid(): boolean {
    return this.valid;
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
