const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const updateOrphanage = async (req, res) => {
    try {

        
        console.log("Request ID:", req.params.id); // Debug line
        console.log("Request Body:", req.body); // Debug line

      await prisma.orphanage.update({
        where: {
          orphanageid: req.params.id   
        },
        data:{
            orphanagename: req.body.orphanagename,
            address: req.body.address,
            capacity: parseInt(req.body.capacity),
            telno: parseInt(req.body.telno),
            head_email: req.body.head_email,
        }
      });
    

    console.log("Orphanage Updated");

    res.status(200).json({
      success: true,
      message: 'Orphanage Updated successfully.'
    });
  } catch (error) {
    console.error('Database query failed:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while deleting orphanage.'
    });
  }
}

module.exports = {
  updateOrphanage
};
