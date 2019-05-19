import * as express from 'express';
import { INTERNAL_SERVER_ERROR, OK } from 'http-status';
import * as log4js from 'log4js';
import { Language, LanguageJSON } from '../../veau-entity/Language';
import { Region, RegionJSON } from '../../veau-entity/Region';
import { CacheError } from '../../veau-error/CacheError';
import { Locales, LocaleUseCase } from '../../veau-usecase/LocaleUseCase';

const router: express.Router = express.Router();
const logger: log4js.Logger = log4js.getLogger();

const localeUseCase: LocaleUseCase = LocaleUseCase.getInstance();

router.get('/', async (req: express.Request, res: express.Response) => {
  const locales: Locales = await localeUseCase.all();

  res.status(OK).send({
    languages: locales.languages.map<LanguageJSON>((language: Language) => {
      return language.toJSON();
    }),
    regions: locales.regions.map<RegionJSON>((region: Region) => {
      return region.toJSON();
    })
  });
});

router.delete('/', async (req: express.Request, res: express.Response) => {
  try {
    await localeUseCase.delete();
    res.sendStatus(OK);
  }
  catch (err) {
    if (err instanceof CacheError) {
      logger.error(err.message);
      res.sendStatus(INTERNAL_SERVER_ERROR);
      return;
    }

    logger.fatal(err.message);
    res.sendStatus(INTERNAL_SERVER_ERROR);
  }
});

export const LocaleController: express.Router = router;
