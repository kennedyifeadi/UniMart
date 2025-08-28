import express from 'express';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes';
import { errorHandler } from './middlewares/error.middleware';

const app = express();

app.use(express.json());
app.use('/auth', authRoutes);
app.use(errorHandler);

export default app;