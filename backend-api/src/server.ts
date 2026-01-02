import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './app';

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/unimart';

mongoose.connect(MONGODB_URI)
	.then(() => {
		console.log('MongoDB connected');
		app.listen(PORT, () => {
			console.log(`Server running on port ${PORT}`);
		});
	})
	.catch((err) => {
		console.error('MongoDB connection error:', err);
		process.exit(1);
	});