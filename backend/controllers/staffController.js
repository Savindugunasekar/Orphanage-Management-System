const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const addStaff = async (req, res) => {
    const { email, orphanageId } = req.body;
    try {
        //trasaction to create new staff and add to staff table
        await prisma.$transaction(async (prisma) => {
            const newStaff = await prisma.users.create({
                data: {
                    email: email,
                    roles: { 'User': 1010, 'Staff': 5528 }
                },
            });

            await prisma.staff.create({
                data: {
                    staffid: newStaff.userid,
                    orphanageid: orphanageId
                },
            });

            console.log('Created new staff');
            res.json({ success: true })
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "An error occurred while adding the staff."
        });
    }
}
const getAllStaff = async(req,res)=>{

    try {
  
      const {orphanageid} = req.query
  
      const staffList = await prisma.staff.findMany({
        where:{
          orphanageid:orphanageid
        },
  
        include:{
          users:{
            select:{
             
              username:true,
              email:true,
              telno:true
            }
          }
        }
      })
  
      res.json({
        success:true,
        staffList:staffList.map((sw)=>({
          staffid:sw.staffid,
          username:sw.users.username,
          email:sw.users.email,
          telno:sw.users.telno
        }))
      })
      
    } catch (error) {
  
      console.error('Database query failed:', error);
      res.status(500).json({
        success: false,
        message: 'An error occurred while fetching staff.'
      });
  
  
      
    }
  }
  
module.exports = { addStaff ,getAllStaff };