const {PrismaClient} = require('@prisma/client');
const {handleLogout} = require('../controllers/logoutController.js');

const prisma = new PrismaClient();

jest.mock('@prisma/client', () => {
    const mockPrisma = {
        users: {
            update: jest.fn(),
            findUnique: jest.fn()
        }
    }
    return { PrismaClient: jest.fn(() => mockPrisma) };
})

describe('handleLogout', () => {



    let req,res;

    beforeEach(() => {

        req={
            cookies:{}
        }

        res={
            status: jest.fn().mockReturnThis(),
            clearCookie: jest.fn(),
            sendStatus:jest.fn(),
            json: jest.fn()
        }



    })


    afterEach(() => {
        jest.clearAllMocks();
    })

    it('should return 204 if no jwt is present in cookies', async () => {

        await handleLogout(req, res);
        expect(res.sendStatus).toHaveBeenCalledWith(204);
        expect(res.clearCookie).not.toHaveBeenCalled();
    })




    it('should return 204 if user with JWT is not found in database', async () => {


        req.cookies.jwt = 'testjwt';

        prisma.users.findUnique.mockResolvedValue(null); // no user with that refresh token


        await handleLogout(req, res);

        expect (prisma.users.findUnique).toHaveBeenCalledWith({
            where: {
                refreshtoken: 'testjwt'
            }
        })


        expect(res.clearCookie).toHaveBeenCalledWith('jwt', { httpOnly: true, sameSite: 'None', secure: true });

        expect(res.sendStatus).toHaveBeenCalledWith(204);


    })



    it('if user exists, update user to remove refreshtoken adn clear JWT cookie', async () => {


        req.cookies.jwt = 'testjwt';

        prisma.users.findUnique.mockResolvedValue({
            userid: 1
    })

    prisma.users.update.mockResolvedValue({})


    await handleLogout(req, res);


    expect (prisma.users.findUnique).toHaveBeenCalledWith({
        where: {
            refreshtoken: 'testjwt'
        }
    })


    expect(prisma.users.update).toHaveBeenCalledWith({
        where: {
            userid: 1
        },
        data: {
            refreshtoken: null
        }
    })


    expect(res.clearCookie).toHaveBeenCalledWith('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    expect(res.sendStatus).toHaveBeenCalledWith(204);


    })


    it('should return 500 if there is an database error', async () => {

        req.cookies.jwt = 'testjwt';

        prisma.users.findUnique.mockRejectedValue(new Error('Database error'));


        await handleLogout(req, res);

        expect(res.status).toHaveBeenCalledWith(500);

        expect(res.json).toHaveBeenCalledWith({ 'message': 'An error occurred while logging out.' ,'success':false });


        
    })





})