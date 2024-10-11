const { PrismaClient } = require('@prisma/client');
const { getRequest } = require('../../controllers/requestController');

// Mock Prisma Client
jest.mock('@prisma/client', () => {
    const mockPrisma = {
        request: {
            findUnique: jest.fn(),
        },
        child_temp: {
            findUnique: jest.fn(),
        },
    };
    return { PrismaClient: jest.fn(() => mockPrisma) };
});

describe('getRequest', () => {
    let prisma, req, res;

    beforeEach(() => {
        prisma = new PrismaClient();
        req = {
            params: { requestId: 'request123' },
            userId: 'user123', // Simulate the logged-in user
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            sendStatus: jest.fn(),
        };
    });

    it('should return 404 if the request is not found', async () => {
        prisma.request.findUnique.mockResolvedValue(null); // Simulate request not found

        await getRequest(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Resource not found',
        });
    });

    it('should return 401 if the user is not authorized to view the request', async () => {
        prisma.request.findUnique.mockResolvedValue({
            requestid: 'request123',
            sender_id: 'otherUser', // Unauthorized user
            receiver_id: 'anotherUser',
        });

        await getRequest(req, res);

        expect(res.sendStatus).toHaveBeenCalledWith(401);
    });

    it('should return 200 with child data if the user is authorized and request entity is "child"', async () => {
        prisma.request.findUnique.mockResolvedValue({
            requestid: 'request123',
            entity: 'child',
            entity_key: 'child123',
            sender_id: 'user123', // Authorized user
            receiver_id: 'otherUser',
        });

        prisma.child_temp.findUnique.mockResolvedValue({
            childid: 'child123',
            name: 'John Doe',
        }); // Simulate child data found

        await getRequest(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            request: {
                requestid: 'request123',
                entity: 'child',
                entity_key: 'child123',
                sender_id: 'user123',
                receiver_id: 'otherUser',
            },
            data: {
                childid: 'child123',
                name: 'John Doe',
            },
        });
    });

    it('should return 500 if a database error occurs', async () => {
        prisma.request.findUnique.mockRejectedValue(new Error('DB error')); // Simulate DB error

        await getRequest(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'An error occurred while fetching request.',
        });
    });
});
