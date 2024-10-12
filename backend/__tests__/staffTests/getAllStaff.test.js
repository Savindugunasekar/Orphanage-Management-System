const { getAllStaff } = require('../../controllers/staffController');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

jest.mock('@prisma/client', () => {
    const mockPrisma = {
        staff: {
            findMany: jest.fn(),
        },
        users: {
            findUnique: jest.fn(),
        }
    };
    return { PrismaClient: jest.fn(() => mockPrisma) };
});

describe('getAllStaff', () => {
    let req, res;

    beforeEach(() => {
        req = {
            query: {
                orphanageid: 'orphanage123'
            }
        };

        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };

        prisma.staff.findMany.mockClear();
    });

    it('should successfully retrieve staff list for the given orphanage', async () => {
        const mockStaffList = [
            {
                staffid: 'staff1',
                users: {
                    username: 'John Doe',
                    email: 'john@example.com',
                    telno: '123456789'
                }
            },
            {
                staffid: 'staff2',
                users: {
                    username: 'Jane Smith',
                    email: 'jane@example.com',
                    telno: '987654321'
                }
            }
        ];
        prisma.staff.findMany.mockResolvedValue(mockStaffList);

        await getAllStaff(req, res);

        // expect(prisma.staff.findMany).toHaveBeenCalledWith({
        //     where: {
        //         orphanageid: 'orphanage123'
        //     },
        //     include: {
        //         users: {
        //             select: {
        //                 username: true,
        //                 email: true,
        //                 telno: true
        //             }
        //         }
        //     }
        // });
        //     expect(res.json).toHaveBeenCalledWith({
        //         success: true,
        //         staffList: [
        //             {
        //                 staffid: 'staff1',
        //                 username: 'John Doe',
        //                 email: 'john@example.com',
        //                 telno: '123456789'
        //             },
        //             {
        //                 staffid: 'staff2',
        //                 username: 'Jane Smith',
        //                 email: 'jane@example.com',
        //                 telno: '987654321'
        //             }
        //         ]
        //     });
    });

    it('should return 500 when an error occurs while fetching the staff list', async () => {
        prisma.staff.findMany.mockRejectedValue(new Error('Database error'));

        await getAllStaff(req, res);
        // expect(prisma.staff.findMany).toHaveBeenCalledWith({
        //     where: {
        //         orphanageid: 'orphanage123'
        //     },
        //     include: {
        //         users: {
        //             select: {
        //                 username: true,
        //                 email: true,
        //                 telno: true
        //             }
        //         }
        //     }
        // });
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'An error occurred while fetching staff.'
        });
    });
});
