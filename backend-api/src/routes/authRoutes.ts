import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import { isAuthenticated } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication and authorization
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - role
 *               - securityQuestion
 *               - securityAnswer
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               role:
 *                 type: string
 *                 enum: [CUSTOMER, VENDOR]
 *               securityQuestion:
 *                 type: string
 *               securityAnswer:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 */
router.post('/register', AuthController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Unauthorized
 */
router.post('/login', AuthController.login);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh the access token
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/refresh', AuthController.refreshToken);

/**
 * @swagger
 * /api/auth/otp/send:
 *   post:
 *     summary: Send an OTP
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *       400:
 *         description: Bad request
 */
router.post('/otp/send', AuthController.sendOtp);

/**
 * @swagger
 * /api/auth/otp/verify:
 *   post:
 *     summary: Verify an OTP
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP verification successful
 *       400:
 *         description: Bad request
 */
router.post('/otp/verify', AuthController.verifyOtp);

/**
 * @swagger
 * /api/auth/password/forgot:
 *   post:
 *     summary: Forgot password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: If a user with that email exists, a password reset link has been sent.
 *       400:
 *         description: Bad request
 */
router.post('/password/forgot', AuthController.forgotPassword);

/**
 * @swagger
 * /api/auth/password/reset:
 *   post:
 *     summary: Reset password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - password
 *             properties:
 *               token:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Password has been reset successfully.
 *       400:
 *         description: Bad request
 */
router.post('/password/reset', AuthController.resetPassword);

/**
 * @swagger
 * /api/auth/security-question/verify:
 *   post:
 *     summary: Verify the security question
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - securityAnswer
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               securityAnswer:
 *                 type: string
 *     responses:
 *       200:
 *         description: Security answer verified successfully.
 *       401:
 *         description: Security answer is incorrect.
 */
router.post('/security-question/verify', AuthController.verifySecurityQuestion);

/**
 * @swagger
 * /api/auth/google:
 *   get:
 *     summary: Log in with Google
 *     tags: [Authentication]
 *     responses:
 *       302:
 *         description: Redirects to Google for authentication
 */
router.get('/google', AuthController.googleLogin);

/**
 * @swagger
 * /api/auth/google/callback:
 *   get:
 *     summary: Google callback
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Login successful
 *       501:
 *         description: Not implemented
 */
router.get('/google/callback', AuthController.googleCallback);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Log out a user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: The refresh token to invalidate.
 *     responses:
 *       200:
 *         description: Logged out successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/logout', isAuthenticated, AuthController.logout);

/**
 * @swagger
 * /api/auth/security-questions:
 *   get:
 *     summary: Get the list of available security questions
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: A list of security questions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *             example:
 *               - "What is your student registration number?"
 *               - "What was the name of your favorite professor in your first year?"
 */
router.get('/security-questions', AuthController.getSecurityQuestions);

export default router;
