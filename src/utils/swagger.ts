import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi, { SwaggerOptions } from "swagger-ui-express";
import express from 'express';
import { ZodAny, ZodObject, ZodRawShape, ZodType, ZodTypeAny, ZodUnknown, deoptional, z } from "zod";

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
        paths: {},
        components: {
            schemas: {},
        }
    },
    apis: [],
};

export function config(app: express.Application) {
    console.log("Configuring swagger");
    const specs = swaggerJsdoc(options);
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
}


export type DecoratorSignature = (target?: any, key?: any, descriptor?: any) => void;

function convertZodToOpenAPI(zodSchema: any): any {
    const openapiSchema: any = {
        type: 'object',
        properties: {},
        required: [],
    };

    for (const [key, value] of Object.entries(zodSchema.shape) as any) {
        openapiSchema.properties[key] = convertZodTypeToOpenAPI(value);
        if (value._def.required) {
            openapiSchema.required.push(key);
        }
    }

    return openapiSchema;
}

// Function to convert Zod type to OpenAPI type
function convertZodTypeToOpenAPI(zodType: any): any {
    if (zodType instanceof z.ZodNumber) {
        return { type: 'number' };
    } else if (zodType instanceof z.ZodString) {
        return { type: 'string' };
    } else if (zodType instanceof z.ZodBoolean) {
        return { type: 'boolean' };
    } else if (zodType instanceof z.ZodArray) {
        return {
            type: 'array',
            items: convertZodTypeToOpenAPI(zodType._def.type),
        };
    } else if (zodType instanceof z.ZodObject) {
        return convertZodToOpenAPI(zodType);
    }

    // Handle other Zod types as needed
}

export enum SwaggerParameterIn {
    Query = "query",
    Path = "path",
    Header = "header",
}

export type SwaggerParameter = {
    name: string;
    in: SwaggerParameterIn;
    required: boolean;
    schema: ZodType;
};


const DefaultSystemResponse = z.object({
    data: z.unknown(),
    message: z.string(),
    status: z.number(),
    success: z.boolean(),
}).required().describe("DefaultSystemResponse");


export function buildSystemDefaultResponse<T extends ZodTypeAny>(response: T): ZodObject<{
    data: deoptional<T>;
    message: z.ZodString;
    status: z.ZodNumber;
    success: z.ZodBoolean;
}> {
    return z.object({
        data: response,
        message: z.string(),
        status: z.number(),
        success: z.boolean(),
    }).required().describe(response._def.description || "DefaultSystemResponse");
}

export enum ResponseType {
    ApplicationJson = "application/json",
}

export type ResponseBody = {
    description: string;
    content: {
        [ResponseType.ApplicationJson]: {
            schema: string;
        };
    };
};


/**
 * 
 * @param path Path of the endpoint it can contain parameters like /user/:id
 * @param responseBody Response body of the endpoint should be a Zod object
 * @param parameters Optional parameters for the endpoint, any parameters in the path should be defined here otherwise an error will be thrown
 * @returns Returns nothing
 */
export function GET<T extends ZodRawShape>(
    path: string,
    responseBody: ZodTypeAny,
    parameters?: SwaggerParameter[],
): DecoratorSignature {
    const newPath = path.replace(/:(\w+)/g, "{$1}");
    const parametersInPath = newPath.match(/{(\w+)}/g);

    if (parametersInPath?.length != parameters?.filter((param) => param.in === "path").length) {
        throw new Error("Not all parameters in the path are defined in the parameters");
    }

    if (!responseBody._def.description) {
        throw new Error("Please provide a description for the response body");
    }

    const responses: Record<string, any> = {};
    options.definition.components.schemas[responseBody._def.description] = convertZodTypeToOpenAPI(responseBody);
    responses["200"] = {
        description: "Success",
        content: {
            "application/json": {
                schema: {
                    "$ref": `#/components/schemas/${responseBody._def.description}`
                }
            },
        },
    };

    const newParameters = [];

    if (parameters) {
        for (const param of parameters) {
            newParameters.push({
                name: param.name,
                in: param.in,
                required: param.required,
                schema: convertZodTypeToOpenAPI(param.schema)
            });
        }
    }

    options.definition.paths[path] = {
        get: {
            summary: "Get request",
            description: "Get request",
            parameters: newParameters,
            responses,
        },
    };
    return (target?: any, key?: any, descriptor?: any) => { };
}
