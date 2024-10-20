const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const { handleNewUser } = require('../controllers/registerController.js');

// Mock Prisma Client
jest.mock('@prisma/client', () => {
    const mockPrisma = {
        users: {
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn()
        }
    };
    return { PrismaClient: jest.fn(() => mockPrisma) };
});

// Mock bcrypt
jest.mock('bcrypt');

describe('handleNewUser', () => {
    let prisma, req, res;

    beforeEach(() => {
        prisma = new PrismaClient();
        req = {
            body: {
                username: 'testuser',
                password: 'password123',
                telno: '1234567890',
                email: 'test@example.com'
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return 400 if any required field is missing', async () => {
        req.body = { username: 'testuser' }; // Missing password, email, and telno

        await handleNewUser(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ 'message': 'All fields are required.' });
    });

    it('should create a new user if user does not exist', async () => {
        prisma.users.findUnique.mockResolvedValue(null); // No user exists
        prisma.users.create.mockResolvedValue({
            id: 1,
            username: 'testuser',
            email: 'test@example.com'
        });

        bcrypt.hash.mockResolvedValue('hashedPassword123'); // Mock hashed password

        await handleNewUser(req, res);

        expect(prisma.users.findUnique).toHaveBeenCalledWith({
            where: { email: 'test@example.com' }
        });
        expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
        expect(prisma.users.create).toHaveBeenCalledWith({
            data: {
                username: 'testuser',
                password: 'hashedPassword123',
                email: 'test@example.com',
                telno: 1234567890,
                roles: { 'User': 1010 },
                verified: true  // Include the verified field in the expected object
            }
        });
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ 'success': 'New user testuser created!' });
    });

    it('should update an existing user if user already exists without a username', async () => {
        // Mock findUnique to return a user without a username
        prisma.users.findUnique.mockResolvedValue({
            id: 1,
            email: 'test@example.com',
            username: null
        });

        // Mock update to simulate user update
        prisma.users.update.mockResolvedValue({
            id: 1,
            username: 'testuser',
            email: 'test@example.com',
            telno: 1234567890,
            verified: true
        });

        // Mock bcrypt.hash
        bcrypt.hash.mockResolvedValue('hashedPassword123');

        await handleNewUser(req, res);

        expect(prisma.users.findUnique).toHaveBeenCalledWith({
            where: { email: 'test@example.com' }
        });
        expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
        expect(prisma.users.update).toHaveBeenCalledWith({
            where: { email: 'test@example.com' },
            data: {
                username: 'testuser',
                password: 'hashedPassword123',
                telno: 1234567890,
                verified: true
            }
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ 'success': 'User testuser updated!' });
    });


    it('should return 500 if there is a server error', async () => {
        prisma.users.findUnique.mockRejectedValue(new Error('Database error'));

        await handleNewUser(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ 'message': 'Database error' });
    });
});
