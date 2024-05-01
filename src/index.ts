import dotenv from "dotenv"
import express from 'express';

import routes from "./routes";
import { flowIdMiddleware } from "./utils/middlewares";

dotenv.config()

const app = express();

if (!process.env.PORT) {
    throw new Error("PORT is not defined in .env file");
}

app.use(express.json());
app.use(flowIdMiddleware);

app.use(routes);


app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${process.env.PORT}`)
});