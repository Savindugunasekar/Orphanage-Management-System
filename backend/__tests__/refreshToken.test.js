const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { handleRefreshToken } = require('../controllers/refreshTokenController.js');

jest.mock('jsonwebtoken');
jest.mock('@prisma/client', () => {
    const mockPrisma = {
        users: {
            findUnique: jest.fn(),
        },
        orphanage: {
            findUnique: jest.fn(),
        },
        socialworker: {
            findUnique: jest.fn(),
        },
        staff: {
            findUnique: jest.fn(),
        }
    };

    return { PrismaClient: jest.fn(() => mockPrisma) };
});

describe('handleRefreshToken', () => {
    let prisma, req, res;

    beforeEach(() => {
        prisma = new PrismaClient();

        req = {
            cookies: {}
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            sendStatus: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return 401 if no jwt cookie is present', async () => {
        await handleRefreshToken(req, res);

        console.log('Expected 401 because there is no JWT cookie');
        console.log('Actual status code:', res.status.mock.calls[0][0]);
        console.log('Response body:', res.json.mock.calls[0][0]);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ 'message': 'there is no jwt cookie' });
    });

    it('should return 403 if no user is found with the refresh token', async () => {
        req.cookies.jwt = 'refreshToken123';
        prisma.users.findUnique.mockResolvedValue(null);

        await handleRefreshToken(req, res);

        console.log('Expected 403 because no user found with the refresh token');
        console.log('Actual status code:', res.status.mock.calls[0][0]);
        console.log('Response body:', res.json.mock.calls[0][0]);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ 'message': 'There is no user with this ref token' });
    });

    it('should return 403 if the JWT verification fails', async () => {
        req.cookies.jwt = 'refreshToken123';
        prisma.users.findUnique.mockResolvedValue({
            userid: 1,
            email: 'test@example.com',
            roles: { 'User': 1010, 'Head': 1910 }
        });
        jwt.verify.mockImplementation((token, secret, callback) => callback(new Error('Invalid token')));

        await handleRefreshToken(req, res);

        console.log('Expected 403 because JWT verification failed');
        console.log('Actual status code:', res.sendStatus.mock.calls[0][0]);

        expect(res.sendStatus).toHaveBeenCalledWith(403);
    });

    it('should return accessToken if the JWT is valid', async () => {
        req.cookies.jwt = 'refreshToken123';
        prisma.users.findUnique.mockResolvedValue({
            userid: 1,
            email: 'test@example.com',
            username: 'testuser',
            roles: { 'User': 1010, 'Head': 1910 }
        });
        prisma.orphanage.findUnique.mockResolvedValue({ orphanageid: 123 });
        jwt.verify.mockImplementation((token, secret, callback) => callback(null, { email: 'test@example.com' }));
        jwt.sign.mockReturnValue('accessToken123');

        await handleRefreshToken(req, res);

        console.log('JWT verification parameters:');
        console.log('Token:', 'refreshToken123');
        console.log('Secret:', process.env.REFRESH_TOKEN_SECRET);
        console.log('Decoded email:', { email: 'test@example.com' });

        console.log('JWT sign parameters:');
        console.log('Payload:', {
            'UserInfo': {
                "userId": 1,
                "username": 'testuser',
                "roles": [1010, 1910],
                "orphanageid": 123
            }
        });
        console.log('Secret:', process.env.ACCESS_TOKEN_SECRET);
        console.log('Options:', { expiresIn: '15min' });
        console.log('Access Token:', 'accessToken123');

        expect(jwt.verify).toHaveBeenCalledWith(
            'refreshToken123',
            process.env.REFRESH_TOKEN_SECRET,
            expect.any(Function)
        );

        expect(jwt.sign).toHaveBeenCalledWith(
            {
                'UserInfo': {
                    "userId": 1,
                    "username": 'testuser',
                    "roles": [1010, 1910],
                    "orphanageid": 123
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '15min' }
        );

        console.log('Access Token Response:', res.json.mock.calls[0][0]);

        expect(res.json).toHaveBeenCalledWith({ accessToken: 'accessToken123' });
    });
});
