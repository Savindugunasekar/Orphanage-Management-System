const { PrismaClient } = require("@prisma/client");
const { updateOrphanage } = require("../../controllers/orphanageController");

jest.mock("@prisma/client", () => {
  const mockPrisma = {
    orphanage: {
      update: jest.fn(), // Use update instead of put
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

describe("updateOrphanage controller", () => {
  let prisma, req, res;

  beforeEach(() => {
    prisma = new PrismaClient();

    req = {
      params: {
        id: "orphanage-id",
      },
      body: {  // body instead of query
        orphanagename: "test-orphanage",
        address: "test-address",
        capacity: "12",
        telno: "0768158332",
        head_email: "test@gmail.com",
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

  it("should update the orphanage and return 'Orphanage Updated successfully'", async () => {
    await updateOrphanage(req, res);

    expect(prisma.orphanage.update).toHaveBeenCalledWith({
      where: {
        orphanageid: req.params.id,
      },
      data: {
        orphanagename: req.body.orphanagename,
        address: req.body.address,
        capacity: parseInt(req.body.capacity),
        telno: parseInt(req.body.telno),
        head_email: req.body.head_email,
      },
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Orphanage Updated successfully.",
    });
  });

  it("should return a 500 error if Prisma query fails", async () => {
    prisma.orphanage.update.mockRejectedValue(new Error("Database error")); // Mock update rejection

    await updateOrphanage(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "An error occurred while updating orphanage.",
    });
  });
});
