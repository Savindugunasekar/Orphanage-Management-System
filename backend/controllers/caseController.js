const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllCases = async (req, res) => {
    const { orphanageid } = req.query;

    try {
        const rawCasesList = await prisma.cases.findMany({
            where: {
                child: {
                    orphanageid: orphanageid
                }
            },
            include: {
                child: {
                    select: {
                        name: true,
                        date_of_birth: true
                    }
                },
                users: { // Fetch parent details
                    select: {
                        username: true,
                        email: true
                    }
                },
                socialworker: { // Fetch social worker details (reference to users table)
                    select: {
                        users: {
                            select: {
                                username: true
                            }
                        }
                    }
                }
            }
        });

        const casesList = rawCasesList.map(caseItem => ({
            caseid: caseItem.caseid,
            childid: caseItem.childid,
            socialworkerid: caseItem.socialworkerid,
            parentid: caseItem.parentid,
            childName: caseItem.child.name,
            childDateOfBirth: caseItem.child.date_of_birth,
            socialWorkerName: caseItem.socialworker?.users?.username,
            parentName: caseItem.users?.username,
            parentEmail: caseItem.users?.email
        }));

        res.json({
            success: true,
            casesList: casesList
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while fetching cases." });
    }
};



const createCase = async (req,res)=>{

    const{socialworkerid,parentid,childid} = req.body

    try {

        const newCase = await prisma.cases.create({
            data:{
                childid:childid,
                parentid:parentid,
                socialworkerid:socialworkerid
            }
        })

        

        res.json({success:true})
        
    } catch (error) {

        console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the case."
    });
        
    }
}

const getCaseById = async (req, res) => {
    try {
        const { caseid } = req.query;

        const rawCaseDetails = await prisma.cases.findUnique({
            where: {
                caseid: caseid
            },
            include: {
                child: true, 
                users: true, 
                socialworker: {
                    include: {
                        users: true 
                    }
                }
            }
        });
        
        if (!rawCaseDetails) {
            return res.status(404).json({ message: "Case not found" });
        }

        const caseItem = {
            caseid: rawCaseDetails.caseid,
            phase1: rawCaseDetails.phase1,
            phase2: rawCaseDetails.phase2,
            child: rawCaseDetails.child,
            parent: rawCaseDetails.users, 
            socialworker: rawCaseDetails.socialworker.users 
        };

        res.status(200).json(caseItem);

    } catch (error) {
        console.error("Error fetching case details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


const getUserCases = async (req, res) => {
    const { userId } = req;

    try {
        const userCases = await prisma.cases.findMany({
            where: {
                parentid: userId
            },
            include: {
                child: {
                    select: {
                        name: true
                    }
                },
                socialworker: {
                    select: {
                        users: {
                            select: {
                                username: true
                            }
                        },
                        orphanage: {
                            select: {
                                orphanagename: true
                            }
                        }
                    }
                },
           
            }
        });

        res.json({
            success: true,
            userCases: userCases.map(caseItem => ({
                ...caseItem,
                childName: caseItem.child.name,
                socialWorkerName: caseItem.socialworker.users.username,
                orphanageName: caseItem.socialworker.orphanage.orphanagename
            }))
        });

    } catch (error) {
        console.error("Error fetching user cases:", error); // Log the error for debugging
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching user cases."
        });
    }
}

const phase1Completed = async (req, res) => {

    try {

        const {caseId}= req.query;
        
        const updatedCase = await prisma.cases.update({

            where: {
                caseid: caseId
            },
            data: {
                phase1: "Completed"
            }
        })

        res.status(200).json({message:"Phase 1 completed"})
    } catch (error) {
        console.log("Error updating case:", error);
    res.status(500).json({ error: "Failed to update case." });
    }

}

const setMeeting = async (req,res)=>{

    try {

        const {caseId,meeting} = req.body;



        const setMeeting = await prisma.cases.update({
            where: { caseid:caseId },
            data: { meetings: { push: meeting } }  
          });
          

        res.status(200).json({message:"Meeting set"})
        
    } catch (error) {
        console.error('Error updating case with meeting', error);
    res.status(500).json({ message: 'Failed to set meeting', error });
        
    }

}

const getMeetings = async(req, res) => {

    try {

        const { caseid } = req.query;

        const caseWithMeetings = await prisma.cases.findUnique({
            where: { caseid: caseid },
            select: { meetings: true }
        });

        res.json({meetings:caseWithMeetings.meetings})


        
    } catch (error) {
        console.error('Error fetching meetings', error);
    res.status(500).json({ message: 'Failed to fetch meetings', error });
        
    }
}

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
const updatedMeetings = currentCase.meetings.map(meeting => {
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



      res.status(200).json({ message: 'Meeting updated successfully', updatedCase });
    } catch (error) {
      console.error('Error updating meeting', error);
      res.status(500).json({ message: 'Failed to update meeting', error });
    }
  };
  
  





module.exports = {createCase , getAllCases,getCaseById,getUserCases,phase1Completed,setMeeting,getMeetings,updateMeeting}