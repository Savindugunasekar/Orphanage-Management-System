const { json } = require("express");
const db = require("../config/dbConn");
const { PrismaClient } = require("@prisma/client");
// const { head } = require("../routes/api/orphanages");
const prisma = new PrismaClient();

const databaseCall = async () => {
  const orphanageCount = await prisma.orphanage.count();
  const childCount = await prisma.child.count();
  const socialWorkerCount = await prisma.socialworker.count();
  const staffCount = await prisma.staff.count();
  const ongoingCaseCount = await prisma.cases.count({
    where: {
      OR: [{ phase1: "Ongoing" }, { phase2: "Ongoing" }, { phase3: "Ongoing" }],
    },
  });
  const pendingApplicationCount = await prisma.application.count({
    where: {
      status: "Pending",
    },
  });

  return {
    orphanageCount,
    childCount,
    socialWorkerCount,
    staffCount,
    ongoingCaseCount,
    pendingApplicationCount,
  };
};

const getOverview = async (req, res) => {
  try {
    const {
      orphanageCount,
      childCount,
      socialWorkerCount,
      staffCount,
      ongoingCaseCount,
      pendingApplicationCount,
    } = await databaseCall();

    res.json({
      success: true,
      data: {
        orphanageCount,
        childCount,
        socialWorkerCount,
        staffCount,
        ongoingCaseCount,
        pendingApplicationCount,
      },
    });
  } catch (error) {
    console.error("Database query failed:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the overview data.",
    });
  }
};

const getAllOrphanage = async (req, res) => {
  try {
    const orphanageList = await prisma.orphanage.findMany();

    res.json({
      success: true,
      orphanageList: orphanageList,
    });
  } catch (error) {
    console.log("Database query failed:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching orphanages.",
    });
  }
};

const addOrphanage = async (req, res) => {
  const { orphanagename, address, capacity, telno, head_email, district } =
    req.body;

  try {
    // Insert new head into users table
    const newHead = await prisma.users.create({
      data: {
        email: head_email,
        roles: { User: 1010, Head: 1910, SocialWorker: 2525 },
      },
    });
    const newHeadId = newHead.userid;

    // Insert new orphanage into orphanage table
    const newOrphanage = await prisma.orphanage.create({
      data: {
        orphanagename: orphanagename,
        headid: newHeadId,
        address: address,
        capacity: +capacity, // Convert to integer otherwise query will fail
        telno: +telno, // Convert to integer otherwise query will fail
        head_email: head_email,
        //district: district -- was not in the original database schema
      },
    });

    res.json({
      success: true,
      orphanage: newOrphanage,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while adding the orphanage.",
    });
  }
};

const getOrphanageByHead = async (req, res) => {
  const { userId } = req;

  try {
    const orphanage = await prisma.orphanage.findUnique({
      where: {
        headid: userId,
      },
    });

    if (!orphanage) {
      return res
        .status(404)
        .json({ error: "Orphanage not found for the given head ID." });
    }

    const orphanageId = orphanage.orphanageid;

    res.json({ orphanageId });
  } catch (error) {
    console.log("Database query failed:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the orphanage." });
  }
};

const getOrphanageHead = async (req, res) => {
  try {
    const { orphanageid } = req.query;

    const orphanage = await prisma.orphanage.findUnique({
      where: { orphanageid: orphanageid },
      select: { headid: true },
    });

    if (!orphanage) {
      return res.status(404).json({ error: "Orphanage not found" });
    }

    const headDetails = await prisma.users.findUnique({
      where: { userid: orphanage.headid },
      select: {
        username: true,
        email: true,
        telno: true,
      },
    });

    if (!headDetails) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ headDetails });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteOrphanage = async (req, res) => {
  try {
    // Delete orphanage
    await prisma.orphanage.delete({
      where: {
        orphanageid: req.params.id,
      },
    });

    console.log("Orphanage deleted");

    res.status(200).json({
      success: true,
      message: "Orphanage deleted successfully.",
    });
  } catch (error) {
    console.log("Database query failed:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting orphanage.",
    });
  }
};

const updateOrphanage = async (req, res) => {
  try {
    console.log("Inside the updateOrphanage")
    console.log("Request ID:", req.params.id); // Debug line
    console.log("Request Body:", req.body); // Debug line

    await prisma.orphanage.update({
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

    console.log("Orphanage Updated");

    res.status(200).json({
      success: true,
      message: "Orphanage Updated successfully.",
    });
  } catch (error) {
    console.log("Database query failed:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating orphanage.",
    });
  }
};

const getOrphanageDetailsById = async (req, res) => {
  console.log(req.params.id);
  const orphanageid = req.params.id; // Ensure the ID is an integer

  try {
    // Fetch the orphanage details from the database
    const orphanage = await prisma.orphanage.findUnique({
      where: {
        orphanageid: orphanageid, // Use 'id' or the appropriate field name in your schema
      },
    });

    // Check if the orphanage exists
    if (!orphanage) {
      return res.status(404).json({
        success: false,
        message: "Orphanage not found.",
      });
    }

    res.json({
      success: true,
      data: orphanage,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while getting the orphanage.",
    });
  }
};


module.exports = {
  addOrphanage,
  getOrphanageByHead,
  getAllOrphanage,
  getOrphanageHead,
  getOverview,
  deleteOrphanage,
  updateOrphanage,
  getOrphanageDetailsById
};
