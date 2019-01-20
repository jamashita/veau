import * as express from 'express';
import { ILocaleUsecase, Locales, LocaleUsecase } from '../../veau-usecase/LocaleUsecase';

const router: express.Router = express.Router();
const localeUsecase: ILocaleUsecase = LocaleUsecase.getInstance();

router.get('/', async (req: express.Request, res: express.Response) => {
  const locales: Locales = await localeUsecase.all();

  res.send(locales);
});

export const Locale: express.Router = router;
