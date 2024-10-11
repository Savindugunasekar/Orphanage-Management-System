
const { PrismaClient } = require("@prisma/client");
const { application } = require("express");
const prisma = new PrismaClient();
const { v4: uuidv4 } = require('uuid');
const createApplication = async (req, res) => {
  // Extracting data from the request
  const {
    firstname,
    lastname,
    gender,
    dob, // this should be converted
    nic,
    occupation,
    nationality,
    religion,
    nooffamilymembers,
    monthlyincome,
    additionalnote,
    homeaddress,
    city,
    province,
    postalcode,
    telphonenum,
    cellphonenum,
    emailaddress,
    genderofchild,
    reasonforfostering,
    specificneeds,
    additionalcomments,
    userId,
    username,
    ageRange,
  } = req.body;

  try {
    // Ensure `dob` is in the correct ISO-8601 format
    const dobISO = new Date(dob).toISOString();

    const notification = `Pending application from ${username}`;

    // Find all admin users
    const adminUsers = await prisma.users.findMany({
      where: {
        roles: {
          path: ['Admin'], // Check if the key 'Admin' exists
          not: null, // Ensure it is not null
        },
      },
    });

    // Update notifications for each admin user
    await Promise.all(adminUsers.map(async (admin) => {
      await prisma.users.update({
        where: { userid: admin.userid },
        data: {
          notifications: {
            push: notification,
          },
        },
      });
    }));
    // Database call to create a new application
    const newApplication = await prisma.application.create({
      data: {
        applicationid: uuidv4(),
        userid: userId,
        username: username,
        createdat: new Date(),
        status: "Pending",
        emailaddress: emailaddress,
        genderofchild: genderofchild,
        agerange: ageRange,
        firstname: firstname,
        lastname: lastname,
        dob: dobISO,
        nic: nic,
        occupation: occupation,
        nationality: nationality,
        religion: religion,
        nooffamilymembers: parseInt(nooffamilymembers),
        monthlyincome: parseFloat(monthlyincome),
        additionalnote: additionalnote,
        homeaddress: homeaddress,
        city: city,
        province: province,
        postalcode: postalcode,
        telphonenum: telphonenum,
        cellphonenum: cellphonenum,
        reasonforfostering: reasonforfostering,
        specificneeds: specificneeds,
        additionalcomments: additionalcomments,
        gender: gender,
      },
    });

    // Sending the response
    res.json({
      success: true,
      application: newApplication,
    });
  } catch (error) {
    console.log("Database query failed:");
    res.status(500).json({
      success: false,
      message: "An error occurred while adding the application.",
    });
  }
};



const getApplications = async (req, res) => {
  try {
    const applications = await prisma.application.findMany();

    res.json({
      success: true,
      applicationList: applications,
    });
  } catch (error) {
    console.log("Database query failed:");
    res.status(500).json({
      success: false,
      message: "An error occurred while retrieving the pending applications.",
    });
  }
};


const getChildren = async (req, res) => {
  const { agerange, gender } = req.body

  try {
    // Calculate the date ranges based on the agerange
    const currentDate = new Date()
    const maxDate = new Date(currentDate.setFullYear(currentDate.getFullYear() - agerange[0]))
    const minDate = new Date(currentDate.setFullYear(currentDate.getFullYear() - agerange[1]))

    // Fetch the children from the database
    const childrenList = await prisma.child.findMany({
      where: {
        gender: gender,
        date_of_birth: {
          lte: maxDate,
          gte: minDate,
        }
      },
      select: {
        childid: true,
        orphanageid: true,
        name: true,
        orphanage: {
          select: {
            orphanagename: true
          }
        }
      }
    })

    res.json({
      success: true,
      children: childrenList
    })

  } catch (error) {
    console.error('Error fetching children:', error)
    res.status(500).json({ error: 'An error occurred while fetching children.' })
  }
}


const updateApplicationStatus = async (req, res) => {
  try {

    const { applicationid, status } = req.query;


    const application = await prisma.application.findUnique({
      where: {
        applicationid: applicationid
      }
    })


    const userId = application.userid

    if(status === "Rejected"){
      var notification = "Your adoption application has been rejected"
    }else if(status === "Accepted"){
      var notification = "Your adoption application has been accepted. Now choose a child from given options"
    }


    await prisma.users.update({
      where: {
        userid: userId
      },
      data: {
        notifications: {
          push: notification
        }
      }
    })

    const applicationStatus = await prisma.application.update({
      where: {
        applicationid: applicationid
      },
      data: {
        status: status
      }
    })

    res.json({ success: true })

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while accepting application"
    });

  }
}


const addToApprovedList = async (req, res) => {
  try {

    const { applicationId, childId, parentId } = req.body;


    const child = await prisma.child.findUnique({
      where: {
        childid: childId,
      },
      select: {
        orphanageid: true,
        name: true
      }
    });

    const orphanage = await prisma.orphanage.findUnique({
      where: {
        orphanageid: child.orphanageid
      },
      select: {
        headid: true
      }
    });



    const notification = `Assign a social worker to case of ${child.name} `

    await prisma.users.update({
      where: {
        userid: orphanage.headid
      },
      data: {
        notifications: {
          push: notification
        }
      }
    })


    const approvedApplication = await prisma.approvedapplications.create({
      data: {
        applicationid: applicationId,
        childid: childId,
        parentid: parentId,
      },
    });

    res.status(201).json({ message: "Application added to approved list" });





  } catch (error) {

    console.error('Error adding to approved list:', error);
    res.status(500).json({ message: 'Internal server error' });

  }
}

const getApprovedApplications = async (req, res) => {
  try {

    const { orphanageid } = req.query

    const approvedApplications = await prisma.approvedapplications.findMany({
      where: {
        child: {
          orphanageid: orphanageid
        }
      },
      include: {
        application: true,
        child: true
      }
    })


    return res.status(200).json({ approvedList: approvedApplications })



  } catch (error) {
    console.error('Error fetching approved applications:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

const getApprovedApplicationsByUser = async (req, res) => {

  try {
    const { parentId } = req.params
    const approvedApplications = await prisma.approvedapplications.findMany({
      where: {
        parentid: parentId
      }
    })

    return res.status(200).json({ approvedList: approvedApplications })

  } catch (error) {
    console.error('Error fetching approved applications:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

const checkChildInvolvement = async (req, res) => {

  const { childId } = req.params

  if (!childId) return res.status(400).json({ 'success': false, message: 'Bad request' });
  try {
    const applicationCount = await prisma.approvedapplications.count({
      where: {
        childid: childId
      }
    })
    console.log(applicationCount)
    res.status(200).json({ 'success': true, count: applicationCount });
  }
  catch (error) {
    console.error('Error fetching approved applications:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }

}

module.exports = {
  createApplication,
  getApplications,
  getChildren,
  updateApplicationStatus,
  addToApprovedList,
  getApprovedApplications,
  getApprovedApplicationsByUser,
  checkChildInvolvement
};
