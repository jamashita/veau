import {Router} from 'express';
import {Auth} from './Auth';
import {Destroy} from './Destroy';
import {WIP} from './WIP';

const router: Router = Router();

router.use('/auth', Auth);
router.use('/destroy', Destroy);
router.use('/wip', WIP);

export const API = router;
