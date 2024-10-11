const { PrismaClient } = require("@prisma/client");
const { getAllOrphanage } = require("../../controllers/orphanageController");

jest.mock("@prisma/client", () => {
  const mockPrisma = {
    orphanage: {
      findMany: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

describe("getAllOrphanage", () => {
  let prisma, req, res;

  beforeEach(() => {
    prisma = new PrismaClient();

    req = {
      query: {
        orphanageid: "test-orphanage-id",
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

  it("should return a list of orphanages", async () => {
    prisma.orphanage.findMany.mockResolvedValue([
      {
        orphanageid: "orphanage-1",
        headid: "headid-1",
        orphanagename: "Orphanage Name 1",
        address: "Address",
        telno: "Telephone Number",
        head_email: "Head Email",
        capacity: "10",
      },
    ]);

    await getAllOrphanage(req, res);

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      orphanageList: [
        {
          orphanageid: "orphanage-1",
          headid: "headid-1",
          orphanagename: "Orphanage Name 1",
          address: "Address",
          telno: "Telephone Number",
          head_email: "Head Email",
          capacity: "10",
        },
      ],
    });
  });

  it("should return a 500 error if prisma query fails", async () => {
    prisma.orphanage.findMany.mockRejectedValue(new Error("Database error"));

    await getAllOrphanage(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "An error occurred while fetching orphanages.",
      success: false,
    });
  });
});
