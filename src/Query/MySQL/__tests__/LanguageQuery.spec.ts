import { Schrodinger } from '@jamashita/genitore-superposition';
import { MockMySQL, MySQLError } from '@jamashita/catacombe-mysql';
import { UUID } from '@jamashita/anden-uuid';
import 'reflect-metadata';
import sinon, { SinonStub } from 'sinon';
import { kernel } from '../../../Container/Kernel';
import { Type } from '../../../Container/Types';
import { LanguageError } from '../../../VO/Language/Error/LanguageError';
import { ISO639 } from '../../../VO/Language/ISO639';
import { Language, LanguageRow } from '../../../VO/Language/Language';
import { LanguageID } from '../../../VO/Language/LanguageID';
import { Languages } from '../../../VO/Language/Languages';
import { MockLanguageID } from '../../../VO/Language/Mock/MockLanguageID';
import { NoSuchElementError } from '../../Error/NoSuchElementError';
import { LanguageQuery } from '../LanguageQuery';

describe('LanguageQuery', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      expect.assertions(2);

      const languageQuery1: LanguageQuery = kernel.get<LanguageQuery>(Type.LanguageMySQLQuery);
      const languageQuery2: LanguageQuery = kernel.get<LanguageQuery>(Type.LanguageMySQLQuery);

      expect(languageQuery1).toBeInstanceOf(LanguageQuery);
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

      const languageQuery: LanguageQuery = new LanguageQuery(mysql);
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
        const languageID: LanguageID = LanguageID.ofString(rows[i].languageID);

        expect(languages.get(languageID)?.getLanguageID().get().get()).toBe(rows[i].languageID);
        expect(languages.get(languageID)?.getName().get()).toBe(rows[i].name);
        expect(languages.get(languageID)?.getEnglishName().get()).toBe(rows[i].englishName);
        expect(languages.get(languageID)?.getISO639().get()).toBe(rows[i].iso639);
      }
    });

    it('returns Dead when MySQL.execute returns 0 results', async () => {
      expect.assertions(2);

      const mysql: MockMySQL = new MockMySQL();
      const stub: SinonStub = sinon.stub();

      mysql.execute = stub;
      stub.resolves([]);

      const languageQuery: LanguageQuery = new LanguageQuery(mysql);
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

      const languageQuery: LanguageQuery = new LanguageQuery(mysql);
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

      const languageQuery: LanguageQuery = new LanguageQuery(mysql);
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

      expect(language.getLanguageID().get().get()).toBe(rows[0].languageID);
      expect(language.getName().get()).toBe(rows[0].name);
      expect(language.getEnglishName().get()).toBe(rows[0].englishName);
      expect(language.getISO639().get()).toBe(rows[0].iso639);
    });

    it('returns Dead because MySQL returns 0 results', async () => {
      expect.assertions(2);

      const mysql: MockMySQL = new MockMySQL();
      const stub: SinonStub = sinon.stub();

      mysql.execute = stub;
      stub.resolves([]);

      const languageQuery: LanguageQuery = new LanguageQuery(mysql);
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

      const languageQuery: LanguageQuery = new LanguageQuery(mysql);
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

      const languageQuery: LanguageQuery = new LanguageQuery(mysql);
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

      expect(language.getLanguageID().get().get()).toBe(rows[0].languageID);
      expect(language.getName().get()).toBe(rows[0].name);
      expect(language.getEnglishName().get()).toBe(rows[0].englishName);
      expect(language.getISO639().get()).toBe(rows[0].iso639);
    });

    it('returns Dead because MySQL returns 0 results', async () => {
      expect.assertions(2);

      const mysql: MockMySQL = new MockMySQL();
      const stub: SinonStub = sinon.stub();

      mysql.execute = stub;
      stub.resolves([]);

      const languageQuery: LanguageQuery = new LanguageQuery(mysql);
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

      const languageQuery: LanguageQuery = new LanguageQuery(mysql);
      const schrodinger: Schrodinger<Language, LanguageError | MySQLError | NoSuchElementError> = await languageQuery.findByISO639(ISO639.of('aa')).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(MySQLError);
    });
  });
});
