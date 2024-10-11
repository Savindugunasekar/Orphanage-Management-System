const {PrismaClient} = require('@prisma/client');
const {acceptApplication} = require('../../controllers/applicationController');

jest.mock('@prisma/client', () => {

    
    const mockPrisma = {
        application:{
            update: jest.fn()
        }
    }

    return {PrismaClient: jest.fn(() => mockPrisma)}


})


describe('acceptApplication', () => {


    let prisma ,req,res


    beforeEach(()=>{

        prisma = new PrismaClient();

        req={

            query:{

                applicationid:'mock-uuid'

            }

        }

        res ={

            status: jest.fn().mockReturnThis(),

            json: jest.fn()
        }

    })


    afterEach(()=>{

        jest.clearAllMocks();
    })


    it('should accept an application successfully', async () => {

        prisma.application.update.mockResolvedValue({
            applicationid : 'mock-uuid',
            status : 'Accepted'
        })


        await acceptApplication(req,res)    


        expect(prisma.application.update).toHaveBeenCalledWith({

            where:{
                applicationid:'mock-uuid'
            },
            data:{
                status:'Accepted'
            }
        })



        expect(res.json).toHaveBeenCalledWith({
            success:true,
            
        })
    })



    it('should return 500 if there is a server error', async () => {

        prisma.application.update.mockRejectedValue(new Error('Server error'));


        await acceptApplication(req,res)


        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success:false,
            message:'An error occurred while accepting application'
        })

        
    })

})