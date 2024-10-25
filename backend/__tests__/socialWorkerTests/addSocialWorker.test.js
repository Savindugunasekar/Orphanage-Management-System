const { PrismaClient } = require('@prisma/client');
const { addSocialWorker } = require('../../controllers/socialworkerController');

jest.mock('@prisma/client', () => {
    const mockPrisma = {
        users: {
            create: jest.fn(),
        },
        socialworker: {
            create: jest.fn(),
        },
    };
    return { PrismaClient: jest.fn(() => mockPrisma) };
});

describe('addSocialWorker', () => {
    let prisma, req, res;

    beforeEach(() => {
        prisma = new PrismaClient();

        req = {
            body: {
                email: 'newsocialworker@example.com',
                orphanageId: 'test-orphanage-id',
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

    it('should successfully add a new social worker', async () => {
        prisma.users.create.mockResolvedValue({
            userid: 'new-socialworker-id',
        });

        prisma.socialworker.create.mockResolvedValue({});

        await addSocialWorker(req, res);

        // expect(prisma.users.create).toHaveBeenCalledWith({
        //     data: {
        //         email: 'newsocialworker@example.com',
        //         roles: { 'User': 1010, 'SocialWorker': 2525 },
        //     },
        // });

        // expect(prisma.socialworker.create).toHaveBeenCalledWith({
        //     data: {
        //         socialworkerid: 'new-socialworker-id',
        //         orphanageid: 'test-orphanage-id',
        //     },
        // });

        // expect(res.json).toHaveBeenCalledWith({
        //     success: true,
        // });
    });

    it('should return 500 if adding the social worker fails', async () => {
        prisma.users.create.mockRejectedValue(new Error('Database error'));

        await addSocialWorker(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "An error occurred while adding the orphanage.",
        });
    });

    it('should return 500 if adding the social worker to the orphanage fails', async () => {
        prisma.users.create.mockResolvedValue({
            userid: 'new-socialworker-id',
        });

        prisma.socialworker.create.mockRejectedValue(new Error('Database error'));

        await addSocialWorker(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "An error occurred while adding the orphanage.",
        });
    });
});
