import dayjs from 'dayjs';
import { Zeit } from '../Zeit';
import { ZeitError } from '../ZeitError';

describe('Zeit', () => {
  describe('ofString', () => {
    it('normal case', () => {
      const zeit1: Zeit = Zeit.ofString('2000-01-01', 'YYYY-MM-DD');
      const zeit2: Zeit = Zeit.ofString('2000-01-01 01:02:03', 'YYYY-MM-DD HH:mm:ss');

      expect(zeit1.isValid()).toBe(true);
      expect(zeit2.isValid()).toBe(true);
    });

    it('throws ZeitError when the format is incorrect', () => {
      expect(() => {
        Zeit.ofString('2000-01-01', 'YYYY-MM-DD HH:mm:ss');
      }).toThrow(ZeitError);

      expect(() => {
        Zeit.ofString('2000-01-01 01:02:03', 'YYYY-MM-DD');
      }).toThrow(ZeitError);
    });
  });

  describe('max', () => {
    it('normal case', () => {
      const format: string = 'YYYY-MM-DD';
      const zeiten: Array<Zeit> = [
        Zeit.ofString('2000-01-03', format),
        Zeit.ofString('2000-01-01', format),
        Zeit.ofString('2000-01-02', format),
        Zeit.ofString('2000-01-03', format)
      ];

      const max: Zeit = Zeit.max(zeiten, format);
      expect(max.toString()).toBe('2000-01-03');
    });

    it('returns itself when the only one zeit given', () => {
      const format: string = 'YYYY-MM-DD';
      const zeiten: Array<Zeit> = [
        Zeit.ofString('2000-01-01', format)
      ];

      const max: Zeit = Zeit.max(zeiten, format);
      expect(max).toBe(zeiten[0]);
    });

    it('throws ZeitError when empty array given', () => {
      const format: string = 'YYYY-MM-DD';
      const zeiten: Array<Zeit> = [];

      expect(() => {
        Zeit.max(zeiten, format);
      }).toThrow(ZeitError);
    });
  });

  describe('min', () => {
    it('normal case', () => {
      const format: string = 'YYYY-MM-DD';
      const zeiten: Array<Zeit> = [
        Zeit.ofString('2000-01-03', format),
        Zeit.ofString('2000-01-02', format),
        Zeit.ofString('2000-01-01', format),
        Zeit.ofString('2000-01-02', format)
      ];

      const min: Zeit = Zeit.min(zeiten, format);
      expect(min.toString()).toBe('2000-01-01');
    });

    it('returns itself when the only one zeit given', () => {
      const format: string = 'YYYY-MM-DD';
      const zeiten: Array<Zeit> = [
        Zeit.ofString('2000-01-01', format)
      ];

      const min: Zeit = Zeit.min(zeiten, format);
      expect(min).toBe(zeiten[0]);
    });

    it('throws ZeitError when empty array given', () => {
      const format: string = 'YYYY-MM-DD';
      const zeiten: Array<Zeit> = [];

      expect(() => {
        Zeit.max(zeiten, format);
      }).toThrow(ZeitError);
    });
  });

  describe('isValid', () => {
    it('returns dayjs\'s result itself', () => {
      expect(Zeit.ofString('2000-01-01', 'YYYY-MM-DD').isValid()).toBe(true);
      expect(Zeit.ofString('2000-01-01 01:02:03', 'YYYY-MM-DD HH:mm:ss').isValid()).toBe(true);
      expect(Zeit.of(dayjs('2000-YY-03'), 'YYYY-MM-DD HH:mm:ss').isValid()).toBe(false);
      expect(Zeit.of(dayjs('2000-YY-01 YY:02:03'), 'YYYY-MM-DD').isValid()).toBe(false);
    });
  });

  describe('isBefore', () => {
    it('returns true if the value is before than the other', () => {
      const zeit1: Zeit = Zeit.ofString('2000-01-02', 'YYYY-MM-DD');
      const zeit2: Zeit = Zeit.ofString('2000-01-03', 'YYYY-MM-DD');
      const zeit3: Zeit = Zeit.ofString('2000-01-04', 'YYYY-MM-DD');

      expect(zeit2.isBefore(zeit1)).toBe(false);
      expect(zeit2.isBefore(zeit2)).toBe(false);
      expect(zeit2.isBefore(zeit3)).toBe(true);
    });
  });

  describe('isAfter', () => {
    it('returns true if the value is after than the other', () => {
      const zeit1: Zeit = Zeit.ofString('2000-01-02', 'YYYY-MM-DD');
      const zeit2: Zeit = Zeit.ofString('2000-01-03', 'YYYY-MM-DD');
      const zeit3: Zeit = Zeit.ofString('2000-01-04', 'YYYY-MM-DD');

      expect(zeit2.isAfter(zeit1)).toBe(true);
      expect(zeit2.isAfter(zeit2)).toBe(false);
      expect(zeit2.isAfter(zeit3)).toBe(false);
    });
  });

  describe('past', () => {
    it('second', () => {
      const zeit: Zeit = Zeit.ofString('2000-01-01 00:00:00', 'YYYY-MM-DD HH:mm:ss');
      const newZeit: Zeit = zeit.past(5, 'second');

      expect(zeit.toString()).toBe('2000-01-01 00:00:00');
      expect(newZeit.toString()).toBe('1999-12-31 23:59:55');
    });

    it('minute', () => {
      const zeit: Zeit = Zeit.ofString('2000-01-01 00:00:00', 'YYYY-MM-DD HH:mm:ss');
      const newZeit: Zeit = zeit.past(5, 'minute');

      expect(zeit.toString()).toBe('2000-01-01 00:00:00');
      expect(newZeit.toString()).toBe('1999-12-31 23:55:00');
    });

    it('hour', () => {
      const zeit: Zeit = Zeit.ofString('2000-01-01 00:00:00', 'YYYY-MM-DD HH:mm:ss');
      const newZeit: Zeit = zeit.past(5, 'hour');

      expect(zeit.toString()).toBe('2000-01-01 00:00:00');
      expect(newZeit.toString()).toBe('1999-12-31 19:00:00');
    });

    it('day', () => {
      const zeit: Zeit = Zeit.ofString('2000-01-01 00:00:00', 'YYYY-MM-DD HH:mm:ss');
      const newZeit: Zeit = zeit.past(5, 'day');

      expect(zeit.toString()).toBe('2000-01-01 00:00:00');
      expect(newZeit.toString()).toBe('1999-12-27 00:00:00');
    });

    it('week', () => {
      const zeit: Zeit = Zeit.ofString('2000-01-01 00:00:00', 'YYYY-MM-DD HH:mm:ss');
      const newZeit: Zeit = zeit.past(5, 'week');

      expect(zeit.toString()).toBe('2000-01-01 00:00:00');
      expect(newZeit.toString()).toBe('1999-11-27 00:00:00');
    });

    it('month', () => {
      const zeit: Zeit = Zeit.ofString('2000-01-01 00:00:00', 'YYYY-MM-DD HH:mm:ss');
      const newZeit: Zeit = zeit.past(5, 'month');

      expect(zeit.toString()).toBe('2000-01-01 00:00:00');
      expect(newZeit.toString()).toBe('1999-08-01 00:00:00');
    });

    it('year', () => {
      const zeit: Zeit = Zeit.ofString('2000-01-01 00:00:00', 'YYYY-MM-DD HH:mm:ss');
      const newZeit: Zeit = zeit.past(5, 'year');

      expect(zeit.toString()).toBe('2000-01-01 00:00:00');
      expect(newZeit.toString()).toBe('1995-01-01 00:00:00');
    });
  });

  describe('future', () => {
    it('second', () => {
      const zeit: Zeit = Zeit.ofString('2000-01-01 00:00:00', 'YYYY-MM-DD HH:mm:ss');
      const newZeit: Zeit = zeit.future(5, 'second');

      expect(zeit.toString()).toBe('2000-01-01 00:00:00');
      expect(newZeit.toString()).toBe('2000-01-01 00:00:05');
    });

    it('minute', () => {
      const zeit: Zeit = Zeit.ofString('2000-01-01 00:00:00', 'YYYY-MM-DD HH:mm:ss');
      const newZeit: Zeit = zeit.future(5, 'minute');

      expect(zeit.toString()).toBe('2000-01-01 00:00:00');
      expect(newZeit.toString()).toBe('2000-01-01 00:05:00');
    });

    it('hour', () => {
      const zeit: Zeit = Zeit.ofString('2000-01-01 00:00:00', 'YYYY-MM-DD HH:mm:ss');
      const newZeit: Zeit = zeit.future(5, 'hour');

      expect(zeit.toString()).toBe('2000-01-01 00:00:00');
      expect(newZeit.toString()).toBe('2000-01-01 05:00:00');
    });

    it('day', () => {
      const zeit: Zeit = Zeit.ofString('2000-01-01 00:00:00', 'YYYY-MM-DD HH:mm:ss');
      const newZeit: Zeit = zeit.future(5, 'day');

      expect(zeit.toString()).toBe('2000-01-01 00:00:00');
      expect(newZeit.toString()).toBe('2000-01-06 00:00:00');
    });

    it('week', () => {
      const zeit: Zeit = Zeit.ofString('2000-01-01 00:00:00', 'YYYY-MM-DD HH:mm:ss');
      const newZeit: Zeit = zeit.future(5, 'week');

      expect(zeit.toString()).toBe('2000-01-01 00:00:00');
      expect(newZeit.toString()).toBe('2000-02-05 00:00:00');
    });

    it('month', () => {
      const zeit: Zeit = Zeit.ofString('2000-01-01 00:00:00', 'YYYY-MM-DD HH:mm:ss');
      const newZeit: Zeit = zeit.future(5, 'month');

      expect(zeit.toString()).toBe('2000-01-01 00:00:00');
      expect(newZeit.toString()).toBe('2000-06-01 00:00:00');
    });

    it('year', () => {
      const zeit: Zeit = Zeit.ofString('2000-01-01 00:00:00', 'YYYY-MM-DD HH:mm:ss');
      const newZeit: Zeit = zeit.future(5, 'year');

      expect(zeit.toString()).toBe('2000-01-01 00:00:00');
      expect(newZeit.toString()).toBe('2005-01-01 00:00:00');
    });
  });

  describe('equals', () => {
    it('returns true if all the properties are the same', () => {
      const zeit1: Zeit = Zeit.ofString('2000-01-01', 'YYYY-MM-DD');
      const zeit2: Zeit = Zeit.ofString('2000-01-02', 'YYYY-MM-DD');
      const zeit3: Zeit = Zeit.ofString('2000-01-01', 'YYYY-MM-DD');

      expect(zeit1.equals(zeit1)).toBe(true);
      expect(zeit1.equals(zeit2)).toBe(false);
      expect(zeit1.equals(zeit3)).toBe(true);
    });

    it('normal case', () => {
      const zeit1: Zeit = Zeit.ofString('2000-01-01', 'YYYY-MM-DD');
      const zeit2: Zeit = Zeit.ofString('2000-01-02', 'YYYY-MM-DD');
      const zeit3: Zeit = Zeit.ofString('2000-01-01', 'YYYY-MM-DD');

      expect(zeit1.equals(zeit1)).toBe(true);
      expect(zeit1.equals(zeit2)).toBe(false);
      expect(zeit1.equals(zeit3)).toBe(true);
    });
  });

  describe('toString', () => {
    it('with shorthand format', () => {
      expect(Zeit.ofString('2000-01-01', 'YYYY-MM-DD').toString()).toBe('2000-01-01');
      expect(Zeit.ofString('2001-01-01', 'YYYY-MM-DD').toString()).toBe('2001-01-01');
      expect(Zeit.ofString('2000-02-01', 'YYYY-MM-DD').toString()).toBe('2000-02-01');
      expect(Zeit.ofString('2000-01-03', 'YYYY-MM-DD').toString()).toBe('2000-01-03');
    });

    it('with longhand format', () => {
      expect(Zeit.ofString('2000-01-01 00:00:00', 'YYYY-MM-DD HH:mm:ss').toString()).toBe('2000-01-01 00:00:00');
      expect(Zeit.ofString('3000-01-01 00:00:00', 'YYYY-MM-DD HH:mm:ss').toString()).toBe('3000-01-01 00:00:00');
      expect(Zeit.ofString('2000-01-05 00:00:00', 'YYYY-MM-DD HH:mm:ss').toString()).toBe('2000-01-05 00:00:00');
      expect(Zeit.ofString('2000-01-01 06:00:00', 'YYYY-MM-DD HH:mm:ss').toString()).toBe('2000-01-01 06:00:00');
      expect(Zeit.ofString('2000-01-01 00:07:00', 'YYYY-MM-DD HH:mm:ss').toString()).toBe('2000-01-01 00:07:00');
      expect(Zeit.ofString('2000-01-01 00:00:08', 'YYYY-MM-DD HH:mm:ss').toString()).toBe('2000-01-01 00:00:08');
    });
  });
});
