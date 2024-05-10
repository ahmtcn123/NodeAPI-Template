import { v4 } from "uuid";
import { Request, Response, NextFunction } from "express";
import { ZodObject, ZodRawShape } from "zod";
import { ServiceResponse } from "../services/utils";
import { ResponseMessage, ResponseStatus } from "./response";
import logger from "./logger";

//Write middleware for inserting flowId in request headers

/**
 * Middleware to add a flow id to the request headers
 * @param req Express request object
 * @param _ Express response object
 * @param next Express next function
 */
const flowIdMiddleware = (req: any, _: Response, next: NextFunction) => {
    //Add flow id to better track logs
    req.params["connectionInfo"] = {
        flowId: v4(),
        clientIp:
            req.headers["x-forwarded-for"] ||
            req.socket.remoteAddress ||
            req.headers["x-client-ip"],
    };
    next();
};
/**
 * Middleware to validate the request body against a zod schema
 * @param body ZodObject schema to validate the request body against
 * @returns Express middleware function
 */
function validateJsonBodyMiddleware<T extends ZodRawShape>(body: ZodObject<T>) {
    return (req: Request, res: Response, next: NextFunction) => {
        const parsedBody = body.safeParse(req.body);
        if (parsedBody.success) {
            req.body = parsedBody.data;
            next();
        } else {
            const errorMessages = parsedBody.error?.errors?.map(
                (error) => error
            );

            logger.error(`Invalid input: ${JSON.stringify(errorMessages)}`);

            new ServiceResponse()
                .setStatus(ResponseStatus.BAD_REQUEST)
                .setMessage(errorMessages[0].message || ResponseMessage.INVALID_INPUT)
                .setData(errorMessages.map((error) => ({
                    field: error.path.join("."),
                    expected: error.code,
                })))
                .expressRespond(res);
        }
    };
}

export { flowIdMiddleware, validateJsonBodyMiddleware };
