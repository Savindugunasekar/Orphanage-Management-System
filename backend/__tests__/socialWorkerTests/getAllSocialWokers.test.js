const { PrismaClient } = require('@prisma/client');
const { getAllSocialWorkers } = require('../../controllers/socialworkerController');

jest.mock('@prisma/client', () => {
    const mockPrisma = {
        socialworker: {
            findMany: jest.fn(),
        },
    };
    return { PrismaClient: jest.fn(() => mockPrisma) };
});

describe('getAllSocialWorkers', () => {
    let prisma, req, res;

    beforeEach(() => {
        prisma = new PrismaClient();

        req = {
            query: {
                orphanageid: 'test-orphanage-id',
            },
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return a list of social workers', async () => {
        prisma.socialworker.findMany.mockResolvedValue([
            {
                socialworkerid: 'sw-1',
                users: {
                    username: 'Social Worker 1',
                    email: 'sw1@example.com',
                    telno: '1234567890',
                },
                orphanage: {
                    orphanagename: 'Orphanage 1', // Adjust this based on your actual data structure if needed
                },
            },
            {
                socialworkerid: 'sw-2',
                users: {
                    username: 'Social Worker 2',
                    email: 'sw2@example.com',
                    telno: '0987654321',
                },
                orphanage: {
                    orphanagename: 'Orphanage 2', // Adjust this based on your actual data structure if needed
                },
            },
        ]);

        await getAllSocialWorkers(req, res);

        // expect(prisma.socialworker.findMany).toHaveBeenCalledWith({
        //     where: {
        //         orphanageid: 'test-orphanage-id',
        //     },
        //     include: {
        //         users: {
        //             select: {
        //                 username: true,
        //                 email: true,
        //                 telno: true,
        //             },
        //         },
        //         orphanage: { // Add this to match the actual implementation
        //             select: {
        //                 orphanagename: true,
        //             },
        //         },
        //     },
        // });

        expect(res.json).toHaveBeenCalledWith({
            success: true,
            socialWorkerList: [
                {
                    socialworkerid: 'sw-1',
                    username: 'Social Worker 1',
                    email: 'sw1@example.com',
                    telno: '1234567890',
                    "orphanage": "Orphanage 1",
                },
                {
                    socialworkerid: 'sw-2',
                    username: 'Social Worker 2',
                    email: 'sw2@example.com',
                    telno: '0987654321',
                    "orphanage": "Orphanage 2",
                },
            ],
        });
    });


    it('should return a 500 error if fetching social workers fails', async () => {
        prisma.socialworker.findMany.mockRejectedValue(new Error('Database error'));

        await getAllSocialWorkers(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'An error occurred while fetching social workers.',
        });
    });
});
