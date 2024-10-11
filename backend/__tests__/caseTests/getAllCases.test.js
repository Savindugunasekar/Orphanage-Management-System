const {PrismaClient} = require('@prisma/client');
const {getAllCases} = require('../../controllers/caseController');


jest.mock('@prisma/client', () => {
    const mockPrisma = {
        cases: {
            findMany: jest.fn(),
        },
    };
    return { PrismaClient: jest.fn(() => mockPrisma) };
});

describe('getAllCases', () => {


    let prisma,req,res

    beforeEach(() => {


        prisma = new PrismaClient()

        req={
            query:{
                orphanageid:'test-orphanage-id'
            }
        }

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        }



    })

    afterEach(() => {
        jest.clearAllMocks();
    })


    it('should return a list fo cases', async () => {

        prisma.cases.findMany.mockResolvedValue(
            [
                {
                    caseid: 'case-1',
                    childid: 'child-1',
                    socialworkerid: 'sw-1',
                    parentid: 'parent-1',
                    child: {
                        name: 'Child Name 1',
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
                }
            ]
        )


        await getAllCases(req,res)

        expect(prisma.cases.findMany).toHaveBeenCalledWith({
            where: {
                child: {
                    orphanageid: 'test-orphanage-id'
                }
            },
            include: {
                child: {
                    select: {
                        name: true,
                        date_of_birth: true
                    }
                },
                users: {
                    select: {
                        username: true,
                        email: true
                    }
                },
                socialworker: {
                    select: {
                        users: {
                            select: {
                                username: true
                            }
                        }
                    }
                }
            }
        });

        expect(res.json).toHaveBeenCalledWith({
            success: true,
            casesList: [
                {
                    caseid: 'case-1',
                    childid: 'child-1',
                    socialworkerid: 'sw-1',
                    parentid: 'parent-1',
                    childName: 'Child Name 1',
                    childDateOfBirth: new Date('2010-01-01'),
                    socialWorkerName: 'Social Worker 1',
                    parentName: 'Parent 1',
                    parentEmail: 'parent1@example.com'
                }
            ]
        });


    })

    it('should return a 500 error if prisma query fails', async () => {
        prisma.cases.findMany.mockRejectedValue(new Error('Database error'));

        await getAllCases(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "An error occurred while fetching cases." });
    });

})