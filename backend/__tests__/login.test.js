const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const { handleLogin } = require('../controllers/loginController.js');

const ROLES_LIST = require('../config/roles_list');

jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('@prisma/client', () => {
    const mockPrisma = {
        users:{
            findUnique: jest.fn(),
            update:jest.fn()
        },
        orphanage:{
            findUnique:jest.fn()
        },
        socialworker:{
            findUnique:jest.fn()
        },
        staff:{
            findUnique:jest.fn()
        }
    }

    return { PrismaClient: jest.fn(() => mockPrisma) };
});



describe('handleLogin', () => {

    let prisma, req, res;

    beforeEach(() => {

        prisma = new PrismaClient();

        req={
            body:{
                email: 'test@example.com',
                password: 'password123'
            }
        }

        res={
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            sendStatus:jest.fn(),
            cookie : jest.fn()
        }

    }


)


    afterEach(() => {

        jest.clearAllMocks();
    })

    it('should run 400 if email or password missing', async () => {
        req.body ={
            email: 'test@example.com' //password is missing
        }
    
        await handleLogin(req, res);
    
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({'message': 'Email and password are required.'});
    })
    
    
    it('should run 401 if user does not exist', async () => {
    
        prisma.users.findUnique.mockResolvedValue(null);
    
        await handleLogin(req, res);
    
        expect(prisma.users.findUnique).toHaveBeenCalledWith({
            where: { email: 'test@example.com' }
        })
    
        expect(res.sendStatus).toHaveBeenCalledWith(401); //un authorized
    
    
    })
    
    it('should run 401 if password does not match', async () => {
        prisma.users.findUnique.mockResolvedValue({
            id: 1,
            username: 'testuser',
            email: 'test@example.com',
            password: 'hashedPassword'
        });
    
    
    
        bcrypt.compare.mockResolvedValue(false); // passwords doesnt match
    
    
        await handleLogin(req, res);
    
        expect(bcrypt.compare).toHaveBeenCalledWith(
            'password123','hashedPassword'
        )
    
        expect(res.sendStatus).toHaveBeenCalledWith(401); //un authorized
    
    
        })
    
        it('should generate and return accesstoken if login is successfull', async () => {
            
            prisma.users.findUnique.mockResolvedValue({
                id: 1,
                username: 'testuser',
                email: 'test@example.com',
                password: 'hashedPassword',
                roles: { 'User': 1010 ,'Head':1910 }
            });
    
            bcrypt.compare.mockResolvedValue(true);
    
            jwt.sign.mockReturnValueOnce('accesstoken123').mockReturnValueOnce('refreshtoken123'); //mock the tokens
    
            
    
    
    
    
        })
    

})




