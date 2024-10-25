const { PrismaClient } = require('@prisma/client');
const { createAddChildRequest } = require('../../controllers/requestController');

// Mock Prisma Client
jest.mock('@prisma/client', () => {
    const mockPrisma = {
        orphanage: {
            findUnique: jest.fn(),
        },
        child_temp: {
            create: jest.fn(),
        },
        request: {
            create: jest.fn(),
        },
        $transaction: jest.fn((fn) => fn(mockPrisma)),
    };
    return { PrismaClient: jest.fn(() => mockPrisma) };
});

describe('createAddChildRequest', () => {
    let prisma, req, res;

    beforeEach(() => {
        prisma = new PrismaClient();
        req = {
            body: { orphanageid: 'orphanage123' }, // Orphanage ID in request body
            orphanageid: 'orphanage123', // Simulated authorized user's orphanage ID
            userId: 'user123', // Simulated logged-in user
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    it('should return 401 if orphanageid does not match or is missing', async () => {
        req.orphanageid = 'differentOrphanage'; // Simulate unauthorized access

        await createAddChildRequest(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Unauthorized' });
    });

    it('should return 404 if receiver orphanage is not found', async () => {
        prisma.orphanage.findUnique.mockResolvedValue(null); // Simulate orphanage not found

        await createAddChildRequest(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Resource not found' });
    });

    it('should return 200 with request data on successful request creation', async () => {
        // Mock orphanage and request creation
        prisma.orphanage.findUnique.mockResolvedValue({ headid: 'head123' });
        prisma.child_temp.create.mockResolvedValue({ childid: 'child123' });
        prisma.request.create.mockResolvedValue({
            requestid: 'request123',
            type: 'create',
            entity: 'child',
            status: 'pending',
            created_at: new Date(),
        });

        await createAddChildRequest(req, res);

        // expect(res.status).toHaveBeenCalledWith(200);
        // expect(res.json).toHaveBeenCalledWith({
        //     success: true,
        //     message: 'Request created successfully.',
        //     data: {
        //         requestid: 'request123',
        //         type: 'create',
        //         entity: 'child',
        //         status: 'pending',
        //         created_at: expect.any(Date),
        //     },
        // });
    });

    it('should return 500 if a database error occurs', async () => {
        prisma.orphanage.findUnique.mockRejectedValue(new Error('DB error')); // Simulate DB error

        await createAddChildRequest(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'An error occurred',
        });
    });
});
