import * as express from 'express';
import { INTERNAL_SERVER_ERROR, OK } from 'http-status';
import * as log4js from 'log4js';
import { ILocaleUsecase } from '../../veau-usecase/ILocaleUsecase';
import { Locales, LocaleUsecase } from '../../veau-usecase/LocaleUsecase';

const router: express.Router = express.Router();
const logger: log4js.Logger = log4js.getLogger();

const localeUsecase: ILocaleUsecase = LocaleUsecase.getInstance();

router.get('/', async (req: express.Request, res: express.Response) => {
  const locales: Locales = await localeUsecase.all();

  res.send(locales);
});

router.get('/delete', async (req: express.Request, res: express.Response) => {
  try {
    await localeUsecase.deleteCache();
    res.sendStatus(OK);
  }
  catch (err) {
    logger.fatal(err.message);
    res.sendStatus(INTERNAL_SERVER_ERROR);
  }
});

export const Locale: express.Router = router;
