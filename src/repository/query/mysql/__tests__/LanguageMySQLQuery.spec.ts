import { UUID } from '@jamashita/anden-uuid';
import { MockMySQL, MySQLError } from '@jamashita/catacombe-mysql';
import { Schrodinger } from '@jamashita/genitore';
import 'reflect-metadata';
import sinon, { SinonStub } from 'sinon';
import { cask } from '../../../../container/Cask';
import { Type } from '../../../../container/Types';
import { LanguageError } from '../../../../domain/vo/Language/error/LanguageError';
import { ISO639 } from '../../../../domain/vo/Language/ISO639';
import { Language, LanguageRow } from '../../../../domain/vo/Language/Language';
import { LanguageID } from '../../../../domain/vo/Language/LanguageID';
import { Languages } from '../../../../domain/vo/Language/Languages';
import { MockLanguageID } from '../../../../domain/vo/Language/mock/MockLanguageID';
import { NoSuchElementError } from '../../error/NoSuchElementError';
import { LanguageMySQLQuery } from '../LanguageMySQLQuery';

describe('LanguageMySQLQuery', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      expect.assertions(2);

      const languageQuery1: LanguageMySQLQuery = cask.get<LanguageMySQLQuery>(Type.LanguageMySQLQuery);
      const languageQuery2: LanguageMySQLQuery = cask.get<LanguageMySQLQuery>(Type.LanguageMySQLQuery);

      expect(languageQuery1).toBeInstanceOf(LanguageMySQLQuery);
      expect(languageQuery1).toBe(languageQuery2);
    });
  });

  describe('all', () => {
    it('normal case', async () => {
      expect.assertions(11);

      const rows: Array<LanguageRow> = [
        {
          languageID: UUID.v4().get(),
          name: 'аҧсуа бызшәа',
          englishName: 'Abkhazian',
          iso639: 'ab'
        },
        {
          languageID: UUID.v4().get(),
          name: 'Afaraf',
          englishName: 'Afar',
          iso639: 'aa'
        }
      ];

      const mysql: MockMySQL = new MockMySQL();
      const stub: SinonStub = sinon.stub();

      mysql.execute = stub;
      stub.resolves(rows);

      const languageQuery: LanguageMySQLQuery = new LanguageMySQLQuery(mysql);
      const schrodinger: Schrodinger<Languages, LanguageError | MySQLError> = await languageQuery.all().terminate();

      expect(stub.withArgs(`SELECT
      R1.language_id AS languageID,
      R1.name,
      R1.english_name AS englishName,
      R1.iso639
      FROM languages R1
      FORCE INDEX(iso639)
      ORDER BY R1.iso639;`).called).toBe(true);
      expect(schrodinger.isAlive()).toBe(true);

      const languages: Languages = schrodinger.get();

      expect(languages.size()).toBe(2);
      for (let i: number = 0; i < languages.size(); i++) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const languageID: LanguageID = LanguageID.ofString(rows[i]!.languageID);

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(languages.get(languageID)?.getLanguageID().get().get()).toBe(rows[i]!.languageID);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(languages.get(languageID)?.getName().get()).toBe(rows[i]!.name);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(languages.get(languageID)?.getEnglishName().get()).toBe(rows[i]!.englishName);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(languages.get(languageID)?.getISO639().get()).toBe(rows[i]!.iso639);
      }
    });

    it('returns Dead when MySQL.execute returns 0 results', async () => {
      expect.assertions(2);

      const mysql: MockMySQL = new MockMySQL();
      const stub: SinonStub = sinon.stub();

      mysql.execute = stub;
      stub.resolves([]);

      const languageQuery: LanguageMySQLQuery = new LanguageMySQLQuery(mysql);
      const schrodinger: Schrodinger<Languages, LanguageError | MySQLError> = await languageQuery.all().terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(MySQLError);
    });

    it('returns Dead because the client throws MySQLError', async () => {
      expect.assertions(2);

      const mysql: MockMySQL = new MockMySQL();
      const stub: SinonStub = sinon.stub();

      mysql.execute = stub;
      stub.rejects(new MySQLError('test faied'));

      const languageQuery: LanguageMySQLQuery = new LanguageMySQLQuery(mysql);
      const schrodinger: Schrodinger<Languages, LanguageError | MySQLError> = await languageQuery.all().terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(MySQLError);
    });
  });

  describe('find', () => {
    it('normal case', async () => {
      expect.assertions(6);

      const uuid: UUID = UUID.v4();
      const rows: Array<LanguageRow> = [
        {
          languageID: uuid.get(),
          name: 'Afaraf',
          englishName: 'Afar',
          iso639: 'aa'
        }
      ];

      const mysql: MockMySQL = new MockMySQL();
      const stub: SinonStub = sinon.stub();

      mysql.execute = stub;
      stub.resolves(rows);

      const languageQuery: LanguageMySQLQuery = new LanguageMySQLQuery(mysql);
      const schrodinger: Schrodinger<Language, LanguageError | MySQLError | NoSuchElementError> = await languageQuery.find(LanguageID.of(uuid)).terminate();

      expect(stub.withArgs(
        `SELECT
      R1.language_id AS languageID,
      R1.name,
      R1.english_name AS englishName,
      R1.iso639
      FROM languages R1
      WHERE R1.language_id = :languageID;`,
        {
          languageID: uuid.get()
        }
      ).called).toBe(true);
      expect(schrodinger.isAlive()).toBe(true);

      const language: Language = schrodinger.get();

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(language.getLanguageID().get().get()).toBe(rows[0]!.languageID);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(language.getName().get()).toBe(rows[0]!.name);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(language.getEnglishName().get()).toBe(rows[0]!.englishName);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(language.getISO639().get()).toBe(rows[0]!.iso639);
    });

    it('returns Dead because MySQL returns 0 results', async () => {
      expect.assertions(2);

      const mysql: MockMySQL = new MockMySQL();
      const stub: SinonStub = sinon.stub();

      mysql.execute = stub;
      stub.resolves([]);

      const languageQuery: LanguageMySQLQuery = new LanguageMySQLQuery(mysql);
      const schrodinger: Schrodinger<Language, LanguageError | MySQLError | NoSuchElementError> = await languageQuery.find(new MockLanguageID()).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(NoSuchElementError);
    });

    it('returns Dead because the client throws MySQLError', async () => {
      expect.assertions(2);

      const mysql: MockMySQL = new MockMySQL();
      const stub: SinonStub = sinon.stub();

      mysql.execute = stub;
      stub.rejects(new MySQLError('test faied'));

      const languageQuery: LanguageMySQLQuery = new LanguageMySQLQuery(mysql);
      const schrodinger: Schrodinger<Language, LanguageError | MySQLError | NoSuchElementError> = await languageQuery.find(new MockLanguageID()).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(MySQLError);
    });
  });

  describe('findByISO639', () => {
    it('normal case', async () => {
      expect.assertions(6);

      const rows: Array<LanguageRow> = [
        {
          languageID: UUID.v4().get(),
          name: 'Afaraf',
          englishName: 'Afar',
          iso639: 'aa'
        }
      ];

      const mysql: MockMySQL = new MockMySQL();
      const stub: SinonStub = sinon.stub();

      mysql.execute = stub;
      stub.resolves(rows);

      const languageQuery: LanguageMySQLQuery = new LanguageMySQLQuery(mysql);
      const schrodinger: Schrodinger<Language, LanguageError | MySQLError | NoSuchElementError> = await languageQuery.findByISO639(ISO639.of('aa')).terminate();

      expect(stub.withArgs(
        `SELECT
      R1.language_id AS languageID,
      R1.name,
      R1.english_name AS englishName,
      R1.iso639
      FROM languages R1
      WHERE R1.iso639 = :iso639;`,
        {
          iso639: 'aa'
        }
      ).called).toBe(true);
      expect(schrodinger.isAlive()).toBe(true);
      const language: Language = schrodinger.get();

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(language.getLanguageID().get().get()).toBe(rows[0]!.languageID);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(language.getName().get()).toBe(rows[0]!.name);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(language.getEnglishName().get()).toBe(rows[0]!.englishName);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(language.getISO639().get()).toBe(rows[0]!.iso639);
    });

    it('returns Dead because MySQL returns 0 results', async () => {
      expect.assertions(2);

      const mysql: MockMySQL = new MockMySQL();
      const stub: SinonStub = sinon.stub();

      mysql.execute = stub;
      stub.resolves([]);

      const languageQuery: LanguageMySQLQuery = new LanguageMySQLQuery(mysql);
      const schrodinger: Schrodinger<Language, LanguageError | MySQLError | NoSuchElementError> = await languageQuery.findByISO639(ISO639.of('aa')).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(NoSuchElementError);
    });

    it('returns Dead because the client throws MySQLError', async () => {
      expect.assertions(2);

      const mysql: MockMySQL = new MockMySQL();
      const stub: SinonStub = sinon.stub();

      mysql.execute = stub;
      stub.rejects(new MySQLError('test faied'));

      const languageQuery: LanguageMySQLQuery = new LanguageMySQLQuery(mysql);
      const schrodinger: Schrodinger<Language, LanguageError | MySQLError | NoSuchElementError> = await languageQuery.findByISO639(ISO639.of('aa')).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(MySQLError);
    });
  });
});
