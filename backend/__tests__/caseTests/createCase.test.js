const {PrismaClient} = require('@prisma/client');
const {createCase} = require('../../controllers/caseController');


jest.mock('@prisma/client', () => {


    const mockPrisma = {
        cases:{
            create: jest.fn()
        }
    }

    return { PrismaClient: jest.fn(() => mockPrisma) };

})

describe('createCase', () => {

    let prisma,req,res

    beforeEach(() => {
        prisma = new PrismaClient()

        req={
            body:{
                socialworkerid:'sw-id',
                parentid:'parent-id',
                childid:'child-id'
            }
        }

        res={
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }


    })

    afterEach(() => {
        jest.clearAllMocks();
    })

    it('should create a new case and return success', async () => {

        prisma.cases.create.mockResolvedValue({

            caseid:'case-id',

            childid:'child-id',

            socialworkerid:'sw-id',

            parentid:'parent-id',
        })


        await createCase(req,res)

        expect(prisma.cases.create).toHaveBeenCalledWith({
            data: {
                childid: 'child-id',
                parentid: 'parent-id',
                socialworkerid: 'sw-id',
            },

        })

        expect(res.json).toHaveBeenCalledWith({success:true})
    })


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