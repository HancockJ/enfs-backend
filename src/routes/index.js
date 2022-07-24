import express from 'express';
import { infuraKey } from '../config';

const indexRouter = express.Router();

indexRouter.get('/', (req, res) => res.status(200).json({ message: infuraKey }));

export default indexRouter;