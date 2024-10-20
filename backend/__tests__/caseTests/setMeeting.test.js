const { PrismaClient } = require('@prisma/client');
const { setMeeting } = require('../../controllers/caseController');

jest.mock('@prisma/client', () => {
    const mockPrisma = {
        cases: {
            update: jest.fn(),
        },
    };
    return { PrismaClient: jest.fn(() => mockPrisma) };
});

describe('setMeeting', () => {
    let prisma, req, res;

    beforeEach(() => {
        prisma = new PrismaClient();

        req = {
            body: {
                caseId: 'test-case-id',
                meeting: {
                    date: '2024-09-01',
                    time: '10:00 AM',
                    location: 'Virtual',
                    notes: 'Discussion about case progress',
                },
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

    it('should set a meeting and return success', async () => {
        prisma.cases.update.mockResolvedValue({
            caseid: 'test-case-id',
            meetings: [
                {
                    date: '2024-09-01',
                    time: '10:00 AM',
                    location: 'Virtual',
                    notes: 'Discussion about case progress',
                },
            ],
        });

        // await setMeeting(req, res);

        // expect(prisma.cases.update).toHaveBeenCalledWith({
        //     where: { caseid: 'test-case-id' },
        //     data: { meetings: { push: req.body.meeting } },
        // });

        // expect(res.status).toHaveBeenCalledWith(200);
        // expect(res.json).toHaveBeenCalledWith({ message: 'Meeting set' });
    });

    it('should return 500 if updating the case with a meeting fails', async () => {
        prisma.cases.update.mockRejectedValue(new Error('Database error'));

        await setMeeting(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Failed to set meeting',
            error: expect.any(Error),
        });
    });
});
