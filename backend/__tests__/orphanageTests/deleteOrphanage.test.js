const { PrismaClient } = require("@prisma/client");
const { deleteOrphanage } = require("../../controllers/orphanageController");

jest.mock("@prisma/client", () => {
  const mockPrisma = {
    orphanage: {
      delete: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

describe("deleteOrphanage controller", () => {
  let prisma, req, res;

  beforeEach(() => {
    prisma = new PrismaClient();

    req = {
      params: {
        id: "orphanage-id", 
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

  it("should delete the orphanage and return success message", async () => {
    await deleteOrphanage(req, res);

    expect(prisma.orphanage.delete).toHaveBeenCalledWith({
      where: {
        orphanageid: "orphanage-id",
      },
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Orphanage deleted successfully.",
    });
  });

  it("should return a 500 error if Prisma query fails", async () => {
    prisma.orphanage.delete.mockRejectedValue(new Error("Database error"));

    await deleteOrphanage(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "An error occurred while deleting orphanage.",
    });
  });
});
