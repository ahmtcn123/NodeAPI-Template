import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi, { SwaggerOptions } from "swagger-ui-express";
import express from 'express';
import { ZodObject, ZodRawShape } from "zod";

const options: SwaggerOptions = {
    definition: {
        openapi: "3.1.0",
        info: {
            title: process.env.API_TITLE,
            version: process.env.API_VERSION,
            description: process.env.API_DESCRIPTION,
            license: {
                name: process.env.API_LICENSE_NAME,
                url: process.env.API_LICENSE_URL,
            },
            contact: {
                name: process.env.API_CONTACT_NAME,
                url: process.env.API_CONTACT_URL,
                email: process.env.API_CONTACT_EMAIL,
            },
        },
        servers: [
            {
                url: "http://localhost:3000",
            },
        ],
    },
    apis: ["../routes/*.ts"],
};

export function config(app: express.Application) {
    const specs = swaggerJsdoc(options);
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
}


export type DecoratorSignature = (target?: any, key?: any, descriptor?: any) => void;

//GET decorator
export function GET<T extends ZodRawShape>(path: string, body: ZodObject<T>): DecoratorSignature {
    return (target?: any, key?: any, descriptor?: any) => {
        console.log(`Logging target:`, target, key, descriptor, path);
        return descriptor;
    }
}
