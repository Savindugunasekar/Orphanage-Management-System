const { PrismaClient } = require("@prisma/client");
const { getOrphanageByHead } = require("../../controllers/orphanageController");

jest.mock("@prisma/client", () => {
  const mockPrisma = {
    orphanage: {
      findUnique: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

describe("getOrphanageByHead", () => {
  let prisma, req, res;

  beforeEach(() => {
    prisma = new PrismaClient();

    req = {
      userId: "user-id", // assuming userId is passed from middleware
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return orphanage id for the given head", async () => {
    prisma.orphanage.findUnique.mockResolvedValue({
      orphanageid: "orphanage-1",
    });

    await getOrphanageByHead(req, res);

    expect(prisma.orphanage.findUnique).toHaveBeenCalledWith({
      where: {
        headid: "user-id",
      },
    });

    expect(res.json).toHaveBeenCalledWith({
      orphanageId: "orphanage-1",
    });
  });

  it("should return a 404 if orphanage is not found", async () => {
    prisma.orphanage.findUnique.mockResolvedValue(null);

    await getOrphanageByHead(req, res);

    expect(prisma.orphanage.findUnique).toHaveBeenCalledWith({
      where: {
        headid: "user-id",
      },
    });

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: "Orphanage not found for the given head ID.",
    });
  });

  it("should return a 500 error if prisma query fails", async () => {
    prisma.orphanage.findUnique.mockRejectedValue(new Error("Database error"));

    await getOrphanageByHead(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "An error occurred while fetching the orphanage.",
    });
  });
});
