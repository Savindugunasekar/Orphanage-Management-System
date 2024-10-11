const { PrismaClient } = require('@prisma/client');
const ROLES_LIST = require('../../config/roles_list');
const { getOrphanageChildren } = require('../../controllers/childController');

// Mock the Prisma Client
jest.mock('@prisma/client', () => {
    const mockPrisma = {
        child: {
            findMany: jest.fn(),
        },
    };
    return { PrismaClient: jest.fn(() => mockPrisma) };
});

describe('getOrphanageChildren', () => {
    let prisma, req, res;

    beforeEach(() => {
        prisma = new PrismaClient();
        req = {
            params: { orphanageid: '123' },
            roles: [],
            orphanageid: null,
        };
        res = {
            sendStatus: jest.fn(),
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };

    });

    it('should return 401 if user is not Authorized', async () => {
        await getOrphanageChildren(req, res);
        expect(res.sendStatus).toHaveBeenCalledWith(401);
    });

    it('should return the children details if user is an Admin', async () => {
        req.roles = [ROLES_LIST.Admin]; // User is an Admin
        const mockChildren = [{
            childid: 123,
            name: "mockChild1",
            date_of_birth: new Date(),
            gender: 'someGender'
        },
        {
            childid: 456,
            name: "mockChild2",
            date_of_birth: new Date(),
            gender: 'someGender'
        }]
        prisma.child.findMany.mockResolvedValue(mockChildren);

        await getOrphanageChildren(req, res);

        expect(res.json).toHaveBeenCalledWith({
            success: true,
            childrenList: mockChildren,
        });
    });

    it('should return the children details if user is Authorized', async () => {
        req.roles = [ROLES_LIST.Head]; // User is a Head
        req.orphanageid = '123'
        const mockChildren = [{
            childid: 123,
            name: "mockChild1",
            date_of_birth: new Date(),
            gender: 'someGender'
        },
        {
            childid: 456,
            name: "mockChild2",
            date_of_birth: new Date(),
            gender: 'someGender'
        }]
        prisma.child.findMany.mockResolvedValue(mockChildren);

        await getOrphanageChildren(req, res);

        expect(res.json).toHaveBeenCalledWith({
            success: true,
            childrenList: mockChildren,
        });
    });

    it('should return 500 if a database error occurs', async () => {
        req.roles = [ROLES_LIST.Head]; // User is a Head
        req.orphanageid = '123'
        prisma.child.findMany.mockRejectedValue(new Error('Database error'));
        await getOrphanageChildren(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'An error occurred while fetching children.',
        });
    });
});
