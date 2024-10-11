const {PrismaClient} = require('@prisma/client');
const {getApplications} = require('../../controllers/applicationController');

jest.mock('@prisma/client', () => {
    const mockPrisma = {
        application:{
            findMany: jest.fn(),
        }
    }

    return {PrismaClient: jest.fn(() => mockPrisma)}
})


describe('getApplications', () => {


    let prisma ,req,res 


    beforeEach(()=>{

        prisma = new PrismaClient();

        req = {}

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        }




      
        })


    afterEach(()=>{

        jest.clearAllMocks();
    })


    it('should return a list of applications when successful', async () => {

        const mockApplications = [
            {
              applicationid: 'app-1',
              userid: 'user-1',
              username: 'testuser1',
              createdat: new Date(),
              status: 'Pending',
              emailaddress: 'testuser1@example.com',
              genderofchild: 'Male',
              agerange: [5, 10],
              firstname: 'John',
              lastname: 'Doe',
              dob: new Date('1990-01-01'),
              nic: '123456789V',
              occupation: 'Engineer',
              nationality: 'Sri Lankan',
              religion: 'Buddhist',
              nooffamilymembers: 3,
              monthlyincome: 50000,
              homeaddress: '123 Main St',
              city: 'Colombo',
              province: 'Western',
              postalcode: '00100',
              telphonenum: '0111234567',
              cellphonenum: '0771234567',
              reasonforfostering: 'Want to provide a loving home',
              specificneeds: 'None',
              additionalcomments: 'Looking forward to the process',
            },
          ];

          prisma.application.findMany.mockResolvedValue(mockApplications);

          await getApplications(req, res);

          expect(prisma.application.findMany).toHaveBeenCalledTimes(1);

          expect(res.json).toHaveBeenCalledWith({
            success: true,
            applicationList: mockApplications,
          })
        
    })

    it('should return a 500 error when an error occurs', async () => {


        const mockError = new Error('Database error');

        prisma.application.findMany.mockRejectedValue(mockError);

        await getApplications(req, res);

        expect(prisma.application.findMany).toHaveBeenCalledTimes(1);

        expect(res.status).toHaveBeenCalledWith(500);

        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'An error occurred while retrieving the pending applications.',
        })

    })




})

