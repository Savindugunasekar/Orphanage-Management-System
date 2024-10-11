const { PrismaClient } = require('@prisma/client');
const ROLES_LIST = require('../../config/roles_list');
const { addChild } = require('../../controllers/childController');

// Mock the Prisma Client
jest.mock('@prisma/client', () => {
    const mockPrisma = {
        child: {
            create: jest.fn(),
        },
    };
    return { PrismaClient: jest.fn(() => mockPrisma) };
});

describe('addChild', () => {
    let prisma, req, res;

    beforeEach(() => {
        prisma = new PrismaClient();
        req = {
            body: {
                orphanageid: '123',
                name: 'some orphanage',
                date_of_birth: 'some',
                gender: 'some',
                nationality: 'some',
                religion: 'some',
                medicaldetails: 'some',
                educationaldetails: 'some'
            },
            orphanageid: '123',
        };
        res = {
            sendStatus: jest.fn(),
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
    });

    it('should return 401 if user is not authorized', async () => {
        req.body.orphanageid = null
        const result = await addChild(req, res);
        expect(result).toBe(401);
    });

    it('should return the child details if user is authorized', async () => {
        prisma.child.create.mockResolvedValue({ ...req.body, childid: '123' });

        const result = await addChild(req, res);

        expect(result).toEqual({
            childid: '123',
            name: req.body.name,
            date_of_birth: req.body.date_of_birth,
            gender: req.body.gender
        })
    });

    it('should return 500 if a database error occurs', async () => {
        prisma.child.create.mockRejectedValue(new Error('Database error'));

        const result = await addChild(req, res);

        expect(result).toBe(500)
    });
});
