const db = require("../config/dbConn");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();



const getSocialWorkersByOrphanage = async (req, res) => {

  try {

    const { orphanageid } = req.query

    const socialWorkerList = await prisma.socialworker.findMany({
      where: {
        orphanageid: orphanageid
      },

      include: {
        users: {
          select: {

            username: true,
            email: true,
            telno: true
          }
        }
      }
    })

    res.json({
      success: true,
      socialWorkerList: socialWorkerList.map((sw) => ({
        socialworkerid: sw.socialworkerid,
        username: sw.users.username,
        email: sw.users.email,
        telno: sw.users.telno
      }))
    })

  } catch (error) {

    console.log('Database query failed:');
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching social workers.'
    });



  }
}

const getAllSocialWorkers = async (req, res) => {

  try {
    const socialWorkerList = await prisma.socialworker.findMany({

      include: {
        users: {
          select: {

            username: true,
            email: true,
            telno: true
          }
        },
        orphanage: {
          select: {
            orphanagename: true
          }
        }
      }
    })

    res.json({
      success: true,
      socialWorkerList: socialWorkerList.map((sw) => ({
        socialworkerid: sw.socialworkerid,
        username: sw.users.username,
        email: sw.users.email,
        telno: sw.users.telno,
        orphanage: sw.orphanage.orphanagename
      }))
    })

  } catch (error) {

    console.log('Database query failed:');
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching social workers.'
    });



  }
}

const addSocialWorker = async (req, res) => {
  const { email, orphanageId } = req.body;

  try {


    // Insert new head into users table
    const newSocialWorker = await prisma.users.create({
      data: {
        email: email,
        roles: { 'User': 1010, 'SocialWorker': 2525 },
      }
    });

    const newSocialWorkerId = newSocialWorker.userid;



    // Insert new orphanage into orphanage table
    await prisma.socialworker.create({
      data: {
        socialworkerid: newSocialWorkerId,
        orphanageid: orphanageId
      }
    });


    res.json({
      success: true,

    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while adding the orphanage."
    });
  }
};



const getOrphanage = async (req, res) => {

  const { userId } = req;

  try {

    const orphanage = await prisma.socialworker.findMany({
      where: {
        socialworkerid: userId
      }
    });

    const orphanageId = orphanage[0].orphanageid

    res.json({ orphanageId })

  } catch (error) {
    console.log('Database query failed:');
    res.status(500).json({ error: 'An error occurred while fetching the orphanage.' });

  }
}


const deleteSocialWorkersByOrphanage = async (req, res) => {
  try {
    console.log("inside the deleteScocil worker", req.params.orphanageid)
    const deletedSocialWorkers = await prisma.socialworker.deleteMany({
      where: {
        orphanageid: req.params.orphanageid
      }
    });
    return res.json({ status: 200, deletedCount: deletedSocialWorkers.count });

  } catch (error) {
    console.error('Database query failed:', error);
    return { status: 500, error: 'Internal server error' };
  }
}



module.exports = {
  addSocialWorker,
  getOrphanage,
  getSocialWorkersByOrphanage,
  getAllSocialWorkers,
  deleteSocialWorkersByOrphanage
}
