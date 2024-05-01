import { Response } from "express"
import { ServiceResponse } from "../services/utils";
import { ResponseMessage, ResponseStatus } from "../utils/response";


class BaseController {
    systemErrorResponse = () => new ServiceResponse().setStatus(ResponseStatus.INTERNAL_SERVER_ERROR).setMessage(ResponseMessage.SYSTEM_ERROR);
}

export {
    BaseController
}