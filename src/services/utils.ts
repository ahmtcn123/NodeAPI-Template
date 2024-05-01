import { Response as ExpressResponse } from 'express';
import { ResponseMessage, ResponseStatus } from '../utils/response';


class ServiceResponse<T> {
    data: T | undefined;
    status: ResponseStatus = ResponseStatus.SUCCESS;
    message: ResponseMessage | string = ResponseMessage.SUCCESS;

    setData(data: T) {
        this.data = data;
        return this;
    }

    setMessage(message: ResponseMessage | string) {
        this.message = message;
        return this;
    }

    setStatus(status: ResponseStatus) {
        this.status = status;
        return this;
    }

    send() {
        return {
            data: this.data,
            message: this.message,
            status: this.status,
            success: this.status === ResponseStatus.SUCCESS
        };
    }

    expressRespond(res: ExpressResponse) {
        return res.status(this.status).send(this.send());
    }
}


class BaseService {


    emptySuccess = () =>
        new ServiceResponse<void>()
}

export { ServiceResponse, BaseService };