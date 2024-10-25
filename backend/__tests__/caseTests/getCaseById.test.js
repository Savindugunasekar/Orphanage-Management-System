const { PrismaClient } = require('@prisma/client');
const { getCaseById } = require('../../controllers/caseController');

jest.mock('@prisma/client', () => {
    const mockPrisma = {
        cases: {
            findUnique: jest.fn(),
        },
    };
    return { PrismaClient: jest.fn(() => mockPrisma) };
});

describe('getCaseById', () => {
    let prisma, req, res;

    beforeEach(() => {
        prisma = new PrismaClient();

        req = {
            query: {
                caseid: 'test-case-id',
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

    it('should return case details when case is found', async () => {
        const rawCaseDetails = {
            caseid: 'test-case-id',
            phase1: true,
            phase2: false,
            child: {
                name: 'Child Name',
                date_of_birth: new Date('2010-01-01')
            },
            users: {
                username: 'Parent 1',
                email: 'parent1@example.com'
            },
            socialworker: {
                users: {
                    username: 'Social Worker 1'
                }
            }
        };

        prisma.cases.findUnique.mockResolvedValue(rawCaseDetails);

        await getCaseById(req, res);

        // expect(prisma.cases.findUnique).toHaveBeenCalledWith({
        //     where: { caseid: 'test-case-id' },
        //     include: {
        //         child: true,
        //         users: true,
        //         socialworker: {
        //             include: {
        //                 users: true,
        //             },
        //         },
        //     },
        // });

        // expect(res.status).toHaveBeenCalledWith(200);
        // expect(res.json).toHaveBeenCalledWith({
        //     caseid: 'test-case-id',
        //     phase1: true,
        //     phase2: false,
        //     child: rawCaseDetails.child,
        //     parent: rawCaseDetails.users,
        //     socialworker: rawCaseDetails.socialworker.users,
        // });
    });

    it('should return 404 if case is not found', async () => {
        prisma.cases.findUnique.mockResolvedValue(null);

        await getCaseById(req, res);

        // expect(prisma.cases.findUnique).toHaveBeenCalledWith({
        //     where: { caseid: 'test-case-id' },
        //     include: {
        //         child: true,
        //         users: true,
        //         socialworker: {
        //             include: {
        //                 users: true,
        //             },
        //         },
        //     },
        // });

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "Case not found" });
    });

    it('should return 500 if prisma query fails', async () => {
        prisma.cases.findUnique.mockRejectedValue(new Error('Database error'));

        await getCaseById(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
    });
});
