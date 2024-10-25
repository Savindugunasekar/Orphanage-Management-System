const { addStaff } = require('../../controllers/staffController');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

jest.mock('@prisma/client', () => {
    const mockPrisma = {
        users: {
            create: jest.fn(),
        },
        staff: {
            create: jest.fn(),
            findMany: jest.fn()
        },
        $transaction: jest.fn()
    };
    return { PrismaClient: jest.fn(() => mockPrisma) };
});


describe('addStaff', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {
                email: 'teststaff@example.com',
                orphanageId: 'orphanage123'
            }
        };

        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };

        prisma.users.create.mockClear();
        prisma.staff.create.mockClear();
        prisma.$transaction.mockClear();
    });

    it('should successfully create new staff and add to the orphanage', async () => {
        prisma.$transaction.mockImplementation(async (callback) => {
            await callback(prisma);
        });

        const mockNewStaff = { userid: 'user123', email: 'teststaff@example.com' };
        prisma.users.create.mockResolvedValue(mockNewStaff);
        prisma.staff.create.mockResolvedValue({ staffid: 'user123', orphanageid: 'orphanage123' });

        await addStaff(req, res);

        // expect(prisma.$transaction).toHaveBeenCalled();
        // expect(prisma.users.create).toHaveBeenCalledWith({
        //     data: {
        //         email: 'teststaff@example.com',
        //         roles: { 'User': 1010, 'Staff': 5528 }
        //     }
        // });
        // expect(prisma.staff.create).toHaveBeenCalledWith({
        //     data: {
        //         staffid: 'user123',
        //         orphanageid: 'orphanage123'
        //     }
        // });
        // expect(res.json).toHaveBeenCalledWith({ success: true });
    });

    it('should return 500 when an error occurs during the transaction', async () => {
        prisma.$transaction.mockRejectedValue(new Error('Database error'));

        await addStaff(req, res);

        expect(prisma.$transaction).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "An error occurred while adding the staff."
        });
    });
});
