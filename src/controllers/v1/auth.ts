import { Request, Response } from 'express';
import { BaseController } from '../utils';

import { z } from 'zod';
import { user } from '../../services';
import { LoginInput } from '../../services/modules/User/core/user';
import { GET, buildSystemDefaultResponse } from '../../utils/swagger';

class Auth extends BaseController {
    @GET("/v1/auth", buildSystemDefaultResponse(z.array(z.number()).describe("LoginOutput")))
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