import Express from 'express';

import v1 from './v1';


const rootRoute = Express.Router();

/// Root Router, place sub-routers here ///
rootRoute.use('/v1', v1);


export default rootRoute;
