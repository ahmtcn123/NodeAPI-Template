import Express, { Request } from 'express';
import { v4 } from 'uuid';

import Auth from '../../controllers/v1/auth';
import { LoginInputSchema } from '../../services/modules/User/core/user';
import { validateJsonBodyMiddleware } from '../../utils/middlewares';

const authRoute = Express.Router();

const auth = new Auth();

/**
 * @swagger
 * /login:
 *  post:
 *   summary: Login
 *  description: Login
 * requestBody:
 * required: true
 * content:
 * 
 */
authRoute.get('/login', validateJsonBodyMiddleware(LoginInputSchema), auth.login)
authRoute.get('/register', auth.login)

export default authRoute;
