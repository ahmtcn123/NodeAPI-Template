import dotenv from "dotenv"
import express from 'express';
import { config } from "./utils/swagger"


import routes from "./routes";
import { flowIdMiddleware } from "./utils/middlewares";
import logger from "./utils/logger";

dotenv.config()

const app = express();

if (!process.env.PORT) {
    throw new Error("PORT is not defined in .env file");
}


app.use(express.json());
app.use(flowIdMiddleware);
app.use(routes);

// Implement swagger
config(app);


app.listen(process.env.PORT, () => {
    logger.info(`Example app listening on port http://localhost:${process.env.PORT}`)
});