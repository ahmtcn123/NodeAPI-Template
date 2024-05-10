import { BaseController } from '../utils';
import { Request, Response } from 'express';

import { user } from '../../services';
import { ServiceResponse } from '../../services/utils';
import { ResponseMessage } from '../../utils/response';
import { LoginInput, LoginInputSchema, UserSchema } from '../../services/modules/User/core/user';
import { GET } from '../../utils/swagger';

class Auth extends BaseController {
    @GET("/v1/auth", LoginInputSchema)
    login = async (req: Request<LoginInput>, res: Response) => {
        let response = this.systemErrorResponse();
        try {
            response = await user.login(req.body);
        } catch (error) {
            //TODO: log error
        }
        response.expressRespond(res);
    }

    register = async (req: Request, res: Response) => {
        let response = this.systemErrorResponse();
        try {
            response = await user.register(req.body);
        } catch (error) {
            //TODO: log error
        }
        response.expressRespond(res);
    }
}

export default Auth;