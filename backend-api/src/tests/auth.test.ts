jest.setTimeout(30000);
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app';
import User from '../models/User';
import dotenv from 'dotenv';
dotenv.config();

jest.setTimeout(30000); // <-- Add this line

describe('Auth API', () => {
	beforeAll(async () => {
		try {
			const uri = process.env.MONGODB_URI;
			if (!uri) throw new Error('MONGODB_URI not set in environment');
			await mongoose.connect(uri);
		} catch (err) {
			console.error('Mongoose connection error:', err);
			throw err;
		}
	}, 100000); // 100 seconds timeout for beforeAll

	afterAll(async () => {
		if (mongoose.connection.db) {
			await mongoose.connection.db.dropDatabase();
		}
		await mongoose.connection.close();
	});

	beforeEach(async () => {
		await User.deleteMany({});
	});

	describe('POST /auth/register', () => {
		it('should register a new user and return tokens', async () => {
			const res = await request(app)
				.post('/auth/register')
				.send({ email: 'test@example.com', password: 'Password1!', role: 'customer' });
			expect(res.status).toBe(201);
			expect(res.body).toHaveProperty('accessToken');
			expect(res.body).toHaveProperty('refreshToken');
		});

		it('should not register with invalid email', async () => {
			const res = await request(app)
				.post('/auth/register')
				.send({ email: 'bademail', password: 'Password1!', role: 'customer' });
			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty('error');
		});

		it('should not register with missing password', async () => {
			const res = await request(app)
				.post('/auth/register')
				.send({ email: 'test2@example.com', role: 'customer' });
			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty('error');
		});

		it('should not register with missing role', async () => {
			const res = await request(app)
				.post('/auth/register')
				.send({ email: 'test3@example.com', password: 'Password1!' });
			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty('error');
		});
	});

	describe('POST /auth/login', () => {
		beforeEach(async () => {
			await User.deleteMany({});
			await request(app)
				.post('/auth/register')
				.send({ email: 'login@example.com', password: 'Password1!', role: 'customer' });
		});

		it('should login with valid credentials', async () => {
			const res = await request(app)
				.post('/auth/login')
				.send({ email: 'login@example.com', password: 'Password1!' });
			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty('accessToken');
			expect(res.body).toHaveProperty('refreshToken');
		});

		it('should not login with invalid credentials', async () => {
			const res = await request(app)
				.post('/auth/login')
				.send({ email: 'login@example.com', password: 'wrongpass' });
			expect(res.status).toBe(401);
			expect(res.body).toHaveProperty('error');
		});

		it('should not login with missing password', async () => {
			const res = await request(app)
				.post('/auth/login')
				.send({ email: 'login@example.com' });
			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty('error');
		});

		it('should not login with missing email', async () => {
			const res = await request(app)
				.post('/auth/login')
				.send({ password: 'Password1!' });
			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty('error');
		});
	});
});
