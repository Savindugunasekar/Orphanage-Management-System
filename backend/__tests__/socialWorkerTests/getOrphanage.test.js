const { PrismaClient } = require('@prisma/client');
const { getOrphanage } = require('../../controllers/socialworkerController');

jest.mock('@prisma/client', () => {
    const mockPrisma = {
        socialworker: {
            findMany: jest.fn(),
        },
    };
    return { PrismaClient: jest.fn(() => mockPrisma) };
});

describe('getOrphanage', () => {
    let prisma, req, res;

    beforeEach(() => {
        prisma = new PrismaClient();

        req = {
            userId: 'test-socialworker-id',
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return the orphanage ID for a given social worker', async () => {
        prisma.socialworker.findMany.mockResolvedValue([
            {
                orphanageid: 'test-orphanage-id',
            },
        ]);

        await getOrphanage(req, res);

        expect(prisma.socialworker.findMany).toHaveBeenCalledWith({
            where: {
                socialworkerid: 'test-socialworker-id',
            },
        });

        expect(res.json).toHaveBeenCalledWith({
            orphanageId: 'test-orphanage-id',
        });
    });

    it('should return 500 if fetching the orphanage fails', async () => {
        prisma.socialworker.findMany.mockRejectedValue(new Error('Database error'));

        await getOrphanage(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: 'An error occurred while fetching the orphanage.',
        });
    });
});
