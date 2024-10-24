const { PrismaClient } = require("@prisma/client");
const { transporter } = require("../config/nodemailer");
const prisma = new PrismaClient();

const addStaff = async (req, res) => {
  const { email, orphanageId } = req.body;
  try {
    //trasaction to create new staff and add to staff table
    await prisma.$transaction(async (prisma) => {
      const newStaff = await prisma.users.create({
        data: {
          email: email,
          roles: { User: 1010, Staff: 5528 },
        },
      });

      
      await prisma.staff.create({
        data: {
          staffid: newStaff.userid,
          orphanageid: orphanageId,
        },
      });
     

});
const verificationUrl = `${process.env.BASE_URL}/register`;

await transporter.sendMail({
  from: process.env.EMAIL,
  to: email,
  subject: 'Assigned to orphanage staff',
  html: `<h1>Complete Your Registration</h1>
         <p>You have been assigned as staff member. Complete your resgistration from link below:</p>
         <a href="${verificationUrl}">Register here</a>`,
});


      console.log("Created new staff");
      res.json({ success: true });
   
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while adding the staff.",
    });
  }
};

const getStaffByOrphanage = async (req, res) => {
  try {
    const { orphanageid } = req.query;

    const staffList = await prisma.staff.findMany({
      where: {
        orphanageid: orphanageid,
      },

      include: {
        users: {
          select: {
            username: true,
            email: true,
            telno: true,
          },
        },
      },
    });

    res.json({
      success: true,
      staffList: staffList.map((sw) => ({
        staffid: sw.staffid,
        username: sw.users.username,
        email: sw.users.email,
        telno: sw.users.telno,
      })),
    });
  } catch (error) {
    console.error("Database query failed:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching staff.",
    });
  }
};

const getAllStaff = async (req, res) => {
  try {

    const staffList = await prisma.staff.findMany({

      include: {
        users: {
          select: {
            username: true,
            email: true,
            telno: true,
          },
        },
        orphanage: {
          select: {
            orphanagename: true
          }
        }
      },
    });

    res.json({
      success: true,
      staffList: staffList.map((sw) => ({
        staffid: sw.staffid,
        username: sw.users.username,
        email: sw.users.email,
        telno: sw.users.telno,
        orphanage: sw.orphanage.orphanagename
      })),
    });
  } catch (error) {
    console.error("Database query failed:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching staff.",
    });
  }
};

const deleteStaffByOrphanage = async (req, res) => {
  try {
    console.log("inside the delete Staff", req.params.orphanageid)
    const deletedStaffs = await prisma.staff.deleteMany({
      where: {
        orphanageid: req.params.orphanageid,
      },

    });
    console.log("deleted the staffs")
    return res.json({ status: 200, deletedCount: deletedStaffs.count });
  } catch (error) {
    console.error("Database query failed:", error);
    return { status: 500, error: "Internal server error" };
  }
};

module.exports = { addStaff, getStaffByOrphanage, deleteStaffByOrphanage, getAllStaff };
