import {Caption, CaptionRow} from '../veau-entity/Caption';
import {Stats} from '../veau-entity/Stats';
import {CaptionFactory} from '../veau-factory/CaptionFactory';
import {VeauMySQL} from '../veau-infrastructure/VeauMySQL';
import {CaptionID} from '../veau-vo/CaptionID';
import {StatsRepository} from './StatsRepository';

const statsRepository: StatsRepository = StatsRepository.getInstance();
const captionFactory: CaptionFactory = CaptionFactory.getInstance();

export class CaptionRepository implements ICaptionRepository {
  private static instance: CaptionRepository = new CaptionRepository();

  public static getInstance(): CaptionRepository {
    return CaptionRepository.instance;
  }

  private constructor() {
  }

  public async findByCaptionID(captionID: CaptionID): Promise<Caption> {
    const query = `SELECT
      R1.caption_id AS captionID,
      R1.language_id AS languageID,
      R2.name AS languageName,
      R2.english_name AS languageEnglishName,
      R2.iso639,
      R1.locale_id AS localeID,
      R3.name AS localeName,
      R3.iso3166,
      R1.name,
      R1.updated_at AS updatedAt
      FROM captions R1
      INNER JOIN languages R2
      USING(language_id)
      INNER JOIN locales R3
      USING(locale_id)
      WHERE R1.caption_id = :captionID;`;

    const rows: Array<CaptionRow> = await VeauMySQL.query(query, [
      {
        captionID: captionID.get().get()
      }
    ]);

    const stats: Array<Stats> = await statsRepository.findByCaptionID(captionID);

    return captionFactory.fromRow(rows[0], stats);
  }
}

export interface ICaptionRepository {

  findByCaptionID(captionID: CaptionID): Promise<Caption>;
}
