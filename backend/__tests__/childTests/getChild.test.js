const { PrismaClient } = require('@prisma/client');
const ROLES_LIST = require('../../config/roles_list');
const { getChild } = require('../../controllers/childController');

// Mock the Prisma Client
jest.mock('@prisma/client', () => {
    const mockPrisma = {
        child: {
            findUnique: jest.fn(),
        },
    };
    return { PrismaClient: jest.fn(() => mockPrisma) };
});

describe('getChild', () => {
    let prisma, req, res;

    beforeEach(() => {
        prisma = new PrismaClient();
        req = {
            params: { childid: '123' },
            roles: [],
            orphanageid: null,
        };
        res = {
            sendStatus: jest.fn(),
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
    });

    it('should return 404 if the child does not exist', async () => {
        prisma.child.findUnique.mockResolvedValue(null);

        await getChild(req, res);

        expect(prisma.child.findUnique).toHaveBeenCalledWith({
            where: { childid: '123' },
        });
        expect(res.sendStatus).toHaveBeenCalledWith(404);
    });

    it('should return 401 if user is not authorized', async () => {
        const mockChild = { childid: '123', orphanageid: '456' };
        prisma.child.findUnique.mockResolvedValue(mockChild);
        req.roles = []; // User has no roles
        req.orphanageid = '789'; // User's orphanageid is different

        await getChild(req, res);

        expect(res.sendStatus).toHaveBeenCalledWith(401);
    });

    it('should return the child details if user is authorized', async () => {
        const mockChild = { childid: '123', orphanageid: '456' };
        prisma.child.findUnique.mockResolvedValue(mockChild);
        req.roles = [ROLES_LIST.Admin]; // User is an Admin

        await getChild(req, res);

        expect(res.json).toHaveBeenCalledWith({
            success: true,
            child: mockChild,
        });
    });

    it('should return 500 if a database error occurs', async () => {
        prisma.child.findUnique.mockRejectedValue(new Error('Database error'));

        await getChild(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'An error occurred while fetching child.',
        });
    });
});
