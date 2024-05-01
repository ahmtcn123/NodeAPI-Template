import express from 'express';

/* Sub-Routes */
import auth from './auth';

const v1Route = express.Router();

v1Route.use('/auth', auth);

export default v1Route;
