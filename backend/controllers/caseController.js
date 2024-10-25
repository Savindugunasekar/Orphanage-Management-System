const { PrismaClient } = require("@prisma/client");
const { application } = require("express");
const prisma = new PrismaClient();

const getAllCases = async (req, res) => {
  const { orphanageid } = req.query;

  try {
    const rawCasesList = await prisma.cases.findMany({
      where: {
        child: {
          orphanageid: orphanageid,
        },
      },
      include: {
        child: {
          select: {
            name: true,
            date_of_birth: true,
          },
        },
        users: {
          // Fetch parent details
          select: {
            username: true,
            email: true,
          },
        },
        socialworker: {
          // Fetch social worker details (reference to users table)
          select: {
            users: {
              select: {
                username: true,
              },
            },
          },
        },
      },
    });

    const casesList = rawCasesList.map((caseItem) => ({
      caseid: caseItem.caseid,
      childid: caseItem.childid,
      socialworkerid: caseItem.socialworkerid,
      parentid: caseItem.parentid,
      childName: caseItem.child.name,
      childDateOfBirth: caseItem.child.date_of_birth,
      socialWorkerName: caseItem.socialworker?.users?.username,
      parentName: caseItem.users?.username,
      parentEmail: caseItem.users?.email,
    }));

    res.json({
      success: true,
      casesList: casesList,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred while fetching cases." });
  }
};

const createCase = async (req, res) => {
  const {
    socialworkerid,
    parentid,
    childid,
    applicationid,
    childname,
    parentname,
  } = req.body;

  try {
    const updateStatus = await prisma.approvedapplications.update({
      where: {
        applicationid: applicationid,
      },

      data: {
        status: "Accepted",
      },
    });

    const notificationsw = `You have been assigned to case of child:${childname} and parent:${parentname} `;
    const notificationUser = `Social worker has been assigend to your case. proceed with phase 01 `;

    await prisma.users.update({
      where: {
        userid: socialworkerid,
      },
      data: {
        notifications: {
          push: notificationsw,
        },
      },
    });

    await prisma.users.update({
      where: {
        userid: parentid,
      },
      data: {
        notifications: {
          push: notificationUser,
        },
      },
    });

    const newCase = await prisma.cases.create({
      data: {
        childid: childid,
        parentid: parentid,
        socialworkerid: socialworkerid,
      },
    });

    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the case.",
    });
  }
};

const getCaseById = async (req, res) => {
  try {
    const { caseid } = req.query;
    const rawCaseDetails = await prisma.cases.findUnique({
      where: {
        caseid: caseid,
      },
      include: {
        child: true,
        users: true,
        approvedapplications: true,
        socialworker: {
          include: {
            users: true,
          },
        },
      },
    });

    if (!rawCaseDetails) {
      return res.status(404).json({ message: "Case not found" });
    }

    const caseItem = {
      caseid: rawCaseDetails.caseid,
      applicationid: rawCaseDetails.application_id,
      phase1: rawCaseDetails.phase1,
      phase2: rawCaseDetails.phase2,
      phase3: rawCaseDetails.phase3,
      child: rawCaseDetails.child,
      parent: rawCaseDetails.users,
      socialworker: rawCaseDetails.socialworker.users,

    };

    res.status(200).json(caseItem);
  } catch (error) {
    console.log("Error fetching case details:");
    res.status(500).json({ message: "Internal server error" });
  }
};


const deleteCaseById = async (req, res) => {
  try {
    const { caseDetails } = req.body;

    // Check if the case exists
    const existingCase = await prisma.cases.findUnique({
      where: { caseid: caseDetails.caseid }
    });

    if (!existingCase) {
      return res.status(404).json({ message: 'Case not found' });
    }

    // Delete the case and the approved application
    const deletedCase = await prisma.cases.delete({
      where: { caseid: caseDetails.caseid }
    });

    const deleteApprovedApplication = await prisma.approvedapplications.delete({
      where: { applicationid: caseDetails.applicationid }
    });

    // Return a success response
    return res.status(200).json({ message: 'Case and approved application deleted successfully' });

  } catch (error) {
    console.error('Error deleting case:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};


const getUserCases = async (req, res) => {
  const { userId } = req;

  try {
    const userCases = await prisma.cases.findMany({
      where: {
        parentid: userId,
      },
      include: {
        child: {
          select: {
            name: true,
          },
        },
        socialworker: {
          select: {
            users: {
              select: {
                username: true,
              },
            },
            orphanage: {
              select: {
                orphanagename: true,
              },
            },
          },
        },
      },
    });

    res.json({
      success: true,
      userCases: userCases.map((caseItem) => ({
        ...caseItem,
        childName: caseItem.child.name,
        socialWorkerName: caseItem.socialworker.users.username,
        orphanageName: caseItem.socialworker.orphanage.orphanagename,
      })),
    });
  } catch (error) {
    console.error("Error fetching user cases:", error); // Log the error for debugging
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching user cases.",
    });
  }
};

const phase1Completed = async (req, res) => {
  try {
    const { caseId, status } = req.query;

    const parent = await prisma.cases.findUnique({
      where: {
        caseid: caseId,
      },
      select: {
        parentid: true,
      }
    });

    let notification;

    if (status == "Completed") {
      notification = "Documentation has been verified. Proceed with phase2"
    } else {
      notification = "Documents are invalid. Your application has been rejected. Try applying again"
    }



    await prisma.users.update({
      where: {
        userid: parent.parentid
      },
      data: {
        notifications: {
          push: notification
        }
      }
    })



    if (status == "Completed") {

      const updatedCase = await prisma.cases.update({
        where: {
          caseid: caseId,
        },
        data: {
          phase1: "Completed",
        },
      });

      res.status(200).json({ message: "Phase 1 completed" });

    } else {
      const updatedCase = await prisma.cases.update({
        where: {
          caseid: caseId,
        },
        data: {
          phase1: "Rejected",
        },
      });

      res.status(200).json({ message: "Application Rejected" });


    }


  } catch (error) {
    console.log("Error updating case:", error);
    res.status(500).json({ error: "Failed to update case." });
  }
};



const pahse2Completed = async (req, res) => {
  try {

    const { caseid } = req.query;

    const parent = await prisma.cases.findUnique({
      where: {
        caseid: caseid,
      },
      select: {
        parentid: true,
      }
    });


    const notification = "Meetings has been concluded. Proceed with phase 3"

    await prisma.users.update({
      where: {
        userid: parent.parentid
      },
      data: {
        notifications: {
          push: notification
        }
      }
    })



    const updatedCase = await prisma.cases.update({
      where: {
        caseid: caseid,
      },
      data: {
        phase2: "Completed",
      },
    });

    res.status(200).json({ message: "Phase 2 completed" });

  } catch (error) {

    console.log("Error updating case:", error);
    res.status(500).json({ error: "Failed to update case." });

  }
}

const setMeeting = async (req, res) => {
  try {
    const { caseId, meeting } = req.body;

    const parent = await prisma.cases.findUnique({
      where: {
        caseid: caseId,
      },
      select: {
        parentid: true,
      },
    })


    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };

    const notification = `Meeting scheduled at ${meeting.date.toLocaleString(undefined, options)}`;

    await prisma.users.update({
      where: {
        userid: parent.parentid
      },
      data: {
        notifications: {
          push: notification
        }
      }
    })


    const setMeeting = await prisma.cases.update({
      where: { caseid: caseId },
      data: { meetings: { push: meeting } },
    });

    res.status(200).json({ message: "Meeting set" });
  } catch (error) {
    console.log("Error updating case with meeting");
    res.status(500).json({ message: "Failed to set meeting", error });
  }
};

const setVisits = async (req, res) => {
  try {
    const { caseId, visits } = req.body;


    const parent = await prisma.cases.findUnique({
      where: {
        caseid: caseId,
      },
      select: {
        parentid: true,
      },
    })



    const notification = `Choose one from proposed dates for home visit.`;

    await prisma.users.update({
      where: {
        userid: parent.parentid
      },
      data: {
        notifications: {
          push: notification
        }
      }
    })

    const setVisits = await prisma.cases.update({
      where: { caseid: caseId },
      data: { home_visits: visits },
    });
    res.status(200).json({ message: "Visits set" });
  } catch (error) {
    console.log("Error updating case with visits");
    res.status(500).json({ message: "Failed to set visit", error });
  }
};
const updateVisits = async (req, res) => {
  try {
    const { caseid } = req.query;
    const { updatedVisit } = req.body;

    // Replace home_visits with updatedVisit
    const updatedCase = await prisma.cases.update({
      where: { caseid: caseid },
      data: {
        home_visits: [updatedVisit], // Replace home_visits with the new updatedVisit object
      },
    });

    res.status(200).json({ message: "Visits updated", updatedCase });
  } catch (error) {
    console.log("Error updating case with visits", error);
    res.status(500).json({ message: "Failed to set visit", error });
  }
};



const getMeetings = async (req, res) => {
  try {
    const { caseid } = req.query;

    const caseWithMeetings = await prisma.cases.findUnique({
      where: { caseid: caseid },
      select: { meetings: true },
    });

    res.json({ meetings: caseWithMeetings.meetings });
  } catch (error) {
    console.error("Error fetching meetings", error);
    res.status(500).json({ message: "Failed to fetch meetings", error });
  }
};

const getVisits = async (req, res) => {
  try {
    const { caseid } = req.query;

    const caseWithVisits = await prisma.cases.findUnique({
      where: { caseid: caseid },
      select: { home_visits: true },
    });

    res.json({ visits: caseWithVisits.home_visits });
  } catch (error) {
    console.error("Error fetching visits", error);
    res.status(500).json({ message: "Failed to fetch visits", error });
  }
};

const updateMeeting = async (req, res) => {
  try {
    const { caseid } = req.query;
    const { meeting } = req.body;

    const { date, report } = meeting;

    // Step 1: Retrieve the current case object
    const currentCase = await prisma.cases.findUnique({
      where: { caseid },
    });

    // Step 2: Find the index of the meeting object with the matching date
    const updatedMeetings = currentCase.meetings.map((meeting) => {
      if (meeting.date === date) {
        return { ...meeting, report: report }; // Update the report
      }
      return meeting; // Leave other meetings unchanged
    });

    // Step 3: Update the case with the new meetings array
    const updatedCase = await prisma.cases.update({
      where: { caseid },
      data: {
        meetings: updatedMeetings,
      },
    });

    res
      .status(200)
      .json({ message: "Meeting updated successfully", updatedCase });
  } catch (error) {
    console.error("Error updating meeting", error);
    res.status(500).json({ message: "Failed to update meeting", error });
  }
};




const setApproval = async (req, res) => {
  console.log('setting approval')
  try {

    const { caseId } = req.query
    const { homeCondition } = req.body

    const parent = await prisma.cases.findUnique({
      where: {
        caseid: caseId,
      },
      select: {
        parentid: true,
      },
    })

    const notification = `Your Home conditions has been approved`;

    await prisma.users.update({
      where: {
        userid: parent.parentid
      },
      data: {
        notifications: {
          push: notification
        }
      }
    })

    const updatedCase = await prisma.cases.update({
      where: {
        caseid: caseId,
      },
      data: {
        phase3: "Completed",
        approval_form: homeCondition
      },
    });

    console.log(updatedCase)
    res.sendStatus(200)

  } catch (error) {
    console.log("Error updating case with approval", error);
    res.status(500).json({ message: "Failed to set approval", error });

  }
}


const getApproval = async (req, res) => {
  try {
    const { caseid } = req.query;

    const caseWithApproval = await prisma.cases.findUnique({
      where: { caseid: caseid },
      select: { approval_form: true },
    });

    res.json({ approval: caseWithApproval.approval_form });
  } catch (error) {
    console.error("Error fetching approval", error);
    res.status(500).json({ message: "Failed to fetch approval", error });
  }
};

module.exports = {
  createCase,
  getAllCases,
  getCaseById,
  getUserCases,
  phase1Completed,
  setMeeting,
  getMeetings,
  updateMeeting,
  pahse2Completed,
  setVisits,
  getVisits,
  updateVisits,
  setApproval,
  getApproval,
  deleteCaseById
};
