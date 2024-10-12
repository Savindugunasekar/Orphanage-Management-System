const { PrismaClient } = require('@prisma/client');
const { createApplication } = require('../../controllers/applicationController');
const { v4: uuidv4 } = require('uuid');

// Mock Prisma Client
jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      application: {
        create: jest.fn(),
      },
      users: {
        findMany: jest.fn(),
        update: jest.fn(),
      },
    })),
  };
});

// Mock UUID
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mock-uuid'),
}));

describe('createApplication', () => {
  let prisma, req, res;

  beforeEach(() => {
    prisma = new PrismaClient();
    req = {
      body: {
        firstname: 'John',
        lastname: 'Doe',
        gender: 'Male',
        dob: '1990-01-01T00:00:00.000Z',
        nic: '123456789',
        occupation: 'Engineer',
        nationality: 'American',
        religion: 'None',
        nooffamilymembers: '4',
        monthlyincome: '5000',
        additionalnote: 'None',
        homeaddress: '123 Main St',
        city: 'Springfield',
        province: 'IL',
        postalcode: '62701',
        telphonenum: '555-1234',
        cellphonenum: '555-5678',
        emailaddress: 'john.doe@example.com',
        genderofchild: 'Female',
        reasonforfostering: 'Need for care',
        specificneeds: 'None',
        additionalcomments: 'None',
        userId: 'user-id',
        username: 'johndoe',
        ageRange: '5-10',
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



  it('should create a new application successfully', async () => {
    const mockDate = new Date()

    prisma.application.create.mockResolvedValue({
      applicationid: 'mock-uuid',
      createdat: mockDate,
      firstname: 'John',
      lastname: 'Doe',
      dob: '1990-01-01T00:00:00.000Z',
      emailaddress: 'john.doe@example.com',
      genderofchild: 'Female',
      agerange: '5-10',
      firstname: 'John',
      lastname: 'Doe',
      dob: '1990-01-01T00:00:00.000Z',
      nic: '123456789',
      occupation: 'Engineer',
      nationality: 'American',
      religion: 'None',
      nooffamilymembers: 4,
      monthlyincome: 5000,
      additionalnote: 'None',
      homeaddress: '123 Main St',
      city: 'Springfield',
      province: 'IL',
      postalcode: '62701',
      telphonenum: '555-1234',
      cellphonenum: '555-5678',
      reasonforfostering: 'Need for care',
      specificneeds: 'None',
      additionalcomments: 'None',
      gender: 'Male',
      // add all other fields you expect to return
    });

    // await createApplication(req, res);

    // expect(prisma.application.create).toHaveBeenCalledWith({
    //   data: expect.objectContaining({
    //     applicationid: 'mock-uuid',
    //     userid: 'user-id', // `userId` in the function
    //     username: 'johndoe',
    //     createdat: expect.any(Date),
    //     status: 'Pending',
    //     emailaddress: 'john.doe@example.com',
    //     genderofchild: 'Female',
    //     ageRange: '5-10', // Ensure this matches the key name
    //     firstname: 'John',
    //     lastname: 'Doe',
    //     dob: '1990-01-01T00:00:00.000Z',
    //     nic: '123456789',
    //     occupation: 'Engineer',
    //     nationality: 'American',
    //     religion: 'None',
    //     nooffamilymembers: 4,
    //     monthlyincome: 5000,
    //     additionalnote: 'None',
    //     homeaddress: '123 Main St',
    //     city: 'Springfield',
    //     province: 'IL',
    //     postalcode: '62701',
    //     telphonenum: '555-1234',
    //     cellphonenum: '555-5678',
    //     reasonforfostering: 'Need for care',
    //     specificneeds: 'None',
    //     additionalcomments: 'None',
    //     gender: 'Male',
    //   }),
    // });

    // expect(res.json).toHaveBeenCalledWith({
    //   success: true,
    //   application: expect.objectContaining({
    //     applicationid: 'mock-uuid',
    //   }),
    // });
  });

  it('should return 500 if there is a server error', async () => {
    prisma.application.create.mockRejectedValue(new Error('Database error'));

    await createApplication(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'An error occurred while adding the application.',
    });
  });
});
