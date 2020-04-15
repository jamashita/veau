import dayjs from 'dayjs';
import { Zeit } from '../Zeit';
import { ZeitError } from '../ZeitError';

// DONE
describe('Zeit', () => {
  describe('ofString', () => {
    it('normal case', () => {
      const zeit1: Zeit = Zeit.ofString('2000-01-01', 'YYYY-MM-DD');
      const zeit2: Zeit = Zeit.ofString('2000-01-01 01:02:03', 'YYYY-MM-DD HH:mm:ss');

      expect(zeit1.isValid()).toEqual(true);
      expect(zeit2.isValid()).toEqual(true);
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

  describe('isValid', () => {
    it('returns dayjs\'s result itself', () => {
      expect(Zeit.ofString('2000-01-01', 'YYYY-MM-DD').isValid()).toEqual(true);
      expect(Zeit.ofString('2000-01-01 01:02:03', 'YYYY-MM-DD HH:mm:ss').isValid()).toEqual(true);
      expect(Zeit.of(dayjs('2000-YY-03'), 'YYYY-MM-DD HH:mm:ss').isValid()).toEqual(false);
      expect(Zeit.of(dayjs('2000-YY-01 YY:02:03'), 'YYYY-MM-DD').isValid()).toEqual(false);
    });
  });

  describe('isBefore', () => {
    it('returns true if the value is before than the other', () => {
      const zeit1: Zeit = Zeit.ofString('2000-01-02', 'YYYY-MM-DD');
      const zeit2: Zeit = Zeit.ofString('2000-01-03', 'YYYY-MM-DD');
      const zeit3: Zeit = Zeit.ofString('2000-01-04', 'YYYY-MM-DD');

      expect(zeit2.isBefore(zeit1)).toEqual(false);
      expect(zeit2.isBefore(zeit2)).toEqual(false);
      expect(zeit2.isBefore(zeit3)).toEqual(true);
    });
  });

  describe('isAfter', () => {
    it('returns true if the value is after than the other', () => {
      const zeit1: Zeit = Zeit.ofString('2000-01-02', 'YYYY-MM-DD');
      const zeit2: Zeit = Zeit.ofString('2000-01-03', 'YYYY-MM-DD');
      const zeit3: Zeit = Zeit.ofString('2000-01-04', 'YYYY-MM-DD');

      expect(zeit2.isAfter(zeit1)).toEqual(true);
      expect(zeit2.isAfter(zeit2)).toEqual(false);
      expect(zeit2.isAfter(zeit3)).toEqual(false);
    });
  });

  describe('past', () => {
    it('second', () => {
      const zeit: Zeit = Zeit.ofString('2000-01-01 00:00:00', 'YYYY-MM-DD HH:mm:ss');
      const newZeit: Zeit = zeit.past(5, 'second');

      expect(zeit.toString()).toEqual('2000-01-01 00:00:00');
      expect(newZeit.toString()).toEqual('1999-12-31 23:59:55');
    });

    it('minute', () => {
      const zeit: Zeit = Zeit.ofString('2000-01-01 00:00:00', 'YYYY-MM-DD HH:mm:ss');
      const newZeit: Zeit = zeit.past(5, 'minute');

      expect(zeit.toString()).toEqual('2000-01-01 00:00:00');
      expect(newZeit.toString()).toEqual('1999-12-31 23:55:00');
    });

    it('hour', () => {
      const zeit: Zeit = Zeit.ofString('2000-01-01 00:00:00', 'YYYY-MM-DD HH:mm:ss');
      const newZeit: Zeit = zeit.past(5, 'hour');

      expect(zeit.toString()).toEqual('2000-01-01 00:00:00');
      expect(newZeit.toString()).toEqual('1999-12-31 19:00:00');
    });

    it('day', () => {
      const zeit: Zeit = Zeit.ofString('2000-01-01 00:00:00', 'YYYY-MM-DD HH:mm:ss');
      const newZeit: Zeit = zeit.past(5, 'day');

      expect(zeit.toString()).toEqual('2000-01-01 00:00:00');
      expect(newZeit.toString()).toEqual('1999-12-27 00:00:00');
    });

    it('week', () => {
      const zeit: Zeit = Zeit.ofString('2000-01-01 00:00:00', 'YYYY-MM-DD HH:mm:ss');
      const newZeit: Zeit = zeit.past(5, 'week');

      expect(zeit.toString()).toEqual('2000-01-01 00:00:00');
      expect(newZeit.toString()).toEqual('1999-11-27 00:00:00');
    });

    it('month', () => {
      const zeit: Zeit = Zeit.ofString('2000-01-01 00:00:00', 'YYYY-MM-DD HH:mm:ss');
      const newZeit: Zeit = zeit.past(5, 'month');

      expect(zeit.toString()).toEqual('2000-01-01 00:00:00');
      expect(newZeit.toString()).toEqual('1999-08-01 00:00:00');
    });

    it('year', () => {
      const zeit: Zeit = Zeit.ofString('2000-01-01 00:00:00', 'YYYY-MM-DD HH:mm:ss');
      const newZeit: Zeit = zeit.past(5, 'year');

      expect(zeit.toString()).toEqual('2000-01-01 00:00:00');
      expect(newZeit.toString()).toEqual('1995-01-01 00:00:00');
    });
  });

  describe('future', () => {
    it('second', () => {
      const zeit: Zeit = Zeit.ofString('2000-01-01 00:00:00', 'YYYY-MM-DD HH:mm:ss');
      const newZeit: Zeit = zeit.future(5, 'second');

      expect(zeit.toString()).toEqual('2000-01-01 00:00:00');
      expect(newZeit.toString()).toEqual('2000-01-01 00:00:05');
    });

    it('minute', () => {
      const zeit: Zeit = Zeit.ofString('2000-01-01 00:00:00', 'YYYY-MM-DD HH:mm:ss');
      const newZeit: Zeit = zeit.future(5, 'minute');

      expect(zeit.toString()).toEqual('2000-01-01 00:00:00');
      expect(newZeit.toString()).toEqual('2000-01-01 00:05:00');
    });

    it('hour', () => {
      const zeit: Zeit = Zeit.ofString('2000-01-01 00:00:00', 'YYYY-MM-DD HH:mm:ss');
      const newZeit: Zeit = zeit.future(5, 'hour');

      expect(zeit.toString()).toEqual('2000-01-01 00:00:00');
      expect(newZeit.toString()).toEqual('2000-01-01 05:00:00');
    });

    it('day', () => {
      const zeit: Zeit = Zeit.ofString('2000-01-01 00:00:00', 'YYYY-MM-DD HH:mm:ss');
      const newZeit: Zeit = zeit.future(5, 'day');

      expect(zeit.toString()).toEqual('2000-01-01 00:00:00');
      expect(newZeit.toString()).toEqual('2000-01-06 00:00:00');
    });

    it('week', () => {
      const zeit: Zeit = Zeit.ofString('2000-01-01 00:00:00', 'YYYY-MM-DD HH:mm:ss');
      const newZeit: Zeit = zeit.future(5, 'week');

      expect(zeit.toString()).toEqual('2000-01-01 00:00:00');
      expect(newZeit.toString()).toEqual('2000-02-05 00:00:00');
    });

    it('month', () => {
      const zeit: Zeit = Zeit.ofString('2000-01-01 00:00:00', 'YYYY-MM-DD HH:mm:ss');
      const newZeit: Zeit = zeit.future(5, 'month');

      expect(zeit.toString()).toEqual('2000-01-01 00:00:00');
      expect(newZeit.toString()).toEqual('2000-06-01 00:00:00');
    });

    it('year', () => {
      const zeit: Zeit = Zeit.ofString('2000-01-01 00:00:00', 'YYYY-MM-DD HH:mm:ss');
      const newZeit: Zeit = zeit.future(5, 'year');

      expect(zeit.toString()).toEqual('2000-01-01 00:00:00');
      expect(newZeit.toString()).toEqual('2005-01-01 00:00:00');
    });
  });

  describe('equals', () => {
    it('returns true if all the properties are the same', () => {
      const zeit1: Zeit = Zeit.ofString('2000-01-01', 'YYYY-MM-DD');
      const zeit2: Zeit = Zeit.ofString('2000-01-02', 'YYYY-MM-DD');
      const zeit3: Zeit = Zeit.ofString('2000-01-01', 'YYYY-MM-DD');

      expect(zeit1.equals(zeit1)).toEqual(true);
      expect(zeit1.equals(zeit2)).toEqual(false);
      expect(zeit1.equals(zeit3)).toEqual(true);
    });

    it('normal case', () => {
      const zeit1: Zeit = Zeit.ofString('2000-01-01', 'YYYY-MM-DD');
      const zeit2: Zeit = Zeit.ofString('2000-01-02', 'YYYY-MM-DD');
      const zeit3: Zeit = Zeit.ofString('2000-01-01', 'YYYY-MM-DD');

      expect(zeit1.equals(zeit1)).toEqual(true);
      expect(zeit1.equals(zeit2)).toEqual(false);
      expect(zeit1.equals(zeit3)).toEqual(true);
    });
  });

  describe('toString', () => {
    it('without format', () => {
      expect(Zeit.ofString('2000-01-01', 'YYYY-MM-DD').toString()).toEqual('2000-01-01');
      expect(Zeit.ofString('2001-01-01', 'YYYY-MM-DD').toString()).toEqual('2001-01-01');
      expect(Zeit.ofString('2000-02-01', 'YYYY-MM-DD').toString()).toEqual('2000-02-01');
      expect(Zeit.ofString('2000-01-03', 'YYYY-MM-DD').toString()).toEqual('2000-01-03');

      expect(Zeit.ofString('2000-01-01 00:00:00', 'YYYY-MM-DD HH:mm:ss').toString()).toEqual('2000-01-01 00:00:00');
      expect(Zeit.ofString('3000-01-01 00:00:00', 'YYYY-MM-DD HH:mm:ss').toString()).toEqual('3000-01-01 00:00:00');
      expect(Zeit.ofString('2000-04-01 00:00:00', 'YYYY-MM-DD HH:mm:ss').toString()).toEqual('2000-04-01 00:00:00');
      expect(Zeit.ofString('2000-01-05 00:00:00', 'YYYY-MM-DD HH:mm:ss').toString()).toEqual('2000-01-05 00:00:00');
      expect(Zeit.ofString('2000-01-01 06:00:00', 'YYYY-MM-DD HH:mm:ss').toString()).toEqual('2000-01-01 06:00:00');
      expect(Zeit.ofString('2000-01-01 00:07:00', 'YYYY-MM-DD HH:mm:ss').toString()).toEqual('2000-01-01 00:07:00');
      expect(Zeit.ofString('2000-01-01 00:00:08', 'YYYY-MM-DD HH:mm:ss').toString()).toEqual('2000-01-01 00:00:08Z');
    });

    it('with shorthand format', () => {
      expect(Zeit.ofString('2000-01-01', 'YYYY-MM-DD').toString()).toEqual('2000-01-01');
      expect(Zeit.ofString('2001-01-01', 'YYYY-MM-DD').toString()).toEqual('2001-01-01');
      expect(Zeit.ofString('2000-02-01', 'YYYY-MM-DD').toString()).toEqual('2000-02-01');
      expect(Zeit.ofString('2000-01-03', 'YYYY-MM-DD').toString()).toEqual('2000-01-03');
    });

    it('with longhand format', () => {
      expect(Zeit.ofString('2000-01-01 00:00:00', 'YYYY-MM-DD HH:mm:ss').toString()).toEqual('2000-01-01 00:00:00');
      expect(Zeit.ofString('3000-01-01 00:00:00', 'YYYY-MM-DD HH:mm:ss').toString()).toEqual('3000-01-01 00:00:00');
      expect(Zeit.ofString('2000-01-05 00:00:00', 'YYYY-MM-DD HH:mm:ss').toString()).toEqual('2000-01-05 00:00:00');
      expect(Zeit.ofString('2000-01-01 06:00:00', 'YYYY-MM-DD HH:mm:ss').toString()).toEqual('2000-01-01 06:00:00');
      expect(Zeit.ofString('2000-01-01 00:07:00', 'YYYY-MM-DD HH:mm:ss').toString()).toEqual('2000-01-01 00:07:00');
      expect(Zeit.ofString('2000-01-01 00:00:08', 'YYYY-MM-DD HH:mm:ss').toString()).toEqual('2000-01-01 00:00:08');
    });
  });
});
