const { updateChild } = require('../../controllers/childController');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

jest.mock('@prisma/client', () => {
    const mockPrisma = {
        child: {
            findUnique: jest.fn(),
            update: jest.fn(),
        },
    };
    return { PrismaClient: jest.fn(() => mockPrisma) };
});

describe('updateChild', () => {
    let req;

    beforeEach(() => {
        req = {
            body: {
                childid: 'child123',
                name: 'Updated Name',
                date_of_birth: '2010-01-01',
                gender: 'Male',
                religion: 'Updated Religion',
                nationality: 'Updated Nationality',
                medicaldetails: 'Updated Medical Details',
                educationaldetails: 'Updated Educational Details',
            },
            orphanageid: 'orphanage123',
        };

        prisma.child.findUnique.mockClear();
        prisma.child.update.mockClear();
    });

    it('should successfully update the child if the user is authorized', async () => {
        prisma.child.findUnique.mockResolvedValue({ orphanageid: 'orphanage123' });

        prisma.child.update.mockResolvedValue({});

        const responseCode = await updateChild(req);

        expect(prisma.child.findUnique).toHaveBeenCalledWith({
            where: {
                childid: 'child123'
            },
            select: { orphanageid: true }
        });

        expect(prisma.child.update).toHaveBeenCalledWith({
            where: {
                childid: 'child123'
            },
            data: {
                name: 'Updated Name',
                date_of_birth: new Date('2010-01-01'),
                gender: 'Male',
                nationality: 'Updated Nationality',
                religion: 'Updated Religion',
                medicaldetails: 'Updated Medical Details',
                educationaldetails: 'Updated Educational Details'
            }
        });

        expect(responseCode).toBe(200);
    });

    it('should return 401 if the user is not authorized to update the child', async () => {
        prisma.child.findUnique.mockResolvedValue({ orphanageid: 'differentOrphanage' });

        const responseCode = await updateChild(req);

        expect(prisma.child.findUnique).toHaveBeenCalledWith({
            where: {
                childid: 'child123'
            },
            select: { orphanageid: true }
        });

        expect(prisma.child.update).not.toHaveBeenCalled();
        expect(responseCode).toBe(401);
    });

    it('should return 404 if the child is not found', async () => {
        prisma.child.findUnique.mockResolvedValue(null);

        const responseCode = await updateChild(req);

        expect(prisma.child.findUnique).toHaveBeenCalledWith({
            where: {
                childid: 'child123'
            },
            select: { orphanageid: true }
        });

        expect(prisma.child.update).not.toHaveBeenCalled();
        expect(responseCode).toBe(404);
    });

    it('should return 500 if an error occurs during the update', async () => {
        prisma.child.findUnique.mockResolvedValue({ orphanageid: 'orphanage123' });

        prisma.child.update.mockRejectedValue(new Error('Database error'));

        const responseCode = await updateChild(req);

        expect(prisma.child.findUnique).toHaveBeenCalledWith({
            where: {
                childid: 'child123'
            },
            select: { orphanageid: true }
        });

        expect(prisma.child.update).toHaveBeenCalled();
        expect(responseCode).toBe(500);
    });
});
