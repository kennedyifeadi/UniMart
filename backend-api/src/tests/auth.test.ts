import request from 'supertest';
import app from '../app';
import mongoose from 'mongoose';
import User from '../models/User';

describe('Auth API', () => {
  beforeAll(async () => {
    // Connect to a test database
    await mongoose.connect('mongodb://localhost:27017/unimart_test_auth', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as any);
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  afterEach(async () => {
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
  });

  describe('POST /auth/login', () => {
    beforeEach(async () => {
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
  });
});
