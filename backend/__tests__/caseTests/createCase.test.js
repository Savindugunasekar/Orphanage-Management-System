const { PrismaClient } = require('@prisma/client');
const { createCase } = require('../../controllers/caseController');


jest.mock('@prisma/client', () => {


    const mockPrisma = {
        cases: {
            create: jest.fn(),
            update: jest.fn(),
        },
        approvedapplications: {
            update: jest.fn(),
        },
        users: {
            update: jest.fn(),
        },

    }

    return { PrismaClient: jest.fn(() => mockPrisma) };

})

describe('createCase', () => {

    let prisma, req, res

    beforeEach(() => {
        prisma = new PrismaClient()

        req = {
            body: {
                socialworkerid: 'sw-id',
                parentid: 'parent-id',
                childid: 'child-id'
            }
        }

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }


    })

    afterEach(() => {
        jest.clearAllMocks();
    })

    it('should create a new case and return success', async () => {
        // Mock request body
        const req = {
            body: {
                socialworkerid: 'sw-id',
                parentid: 'parent-id',
                childid: 'child-id',
                applicationid: 'app-id',
                childname: 'child-name',
                parentname: 'parent-name',
            },
        };

        // Mock response object
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };

        // Mock Prisma calls
        prisma.approvedapplications.update.mockResolvedValue({
            applicationid: 'app-id',
            status: 'Accepted',
        });

        prisma.users.update.mockResolvedValueOnce({
            userid: 'sw-id',
            notifications: ['You have been assigned to case of child:child-name and parent:parent-name '],
        });

        prisma.users.update.mockResolvedValueOnce({
            userid: 'parent-id',
            notifications: ['Social worker has been assigend to your case. proceed with phase 01 '],
        });

        prisma.cases.create.mockResolvedValue({
            caseid: 'case-id',
            childid: 'child-id',
            socialworkerid: 'sw-id',
            parentid: 'parent-id',
        });

        // Call the function
        await createCase(req, res);



        // Assert response
        expect(res.json).toHaveBeenCalledWith({ success: true });
    });



    it('should return a 500 error if prisma query fails', async () => {
        prisma.cases.create.mockRejectedValue(new Error('Database error'));

        await createCase(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "An error occurred while creating the case.",
        });
    });
})