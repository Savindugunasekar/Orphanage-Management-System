// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();

// const deleteOrphanage = async (req, res) => {
//     try {
//       // Delete orphanage
//       await prisma.orphanage.delete({
//         where: {
//           orphanageid: req.params.id
//         }
//       });
    
//       // // Delete associated user
//       // await prisma.user.delete({
//       //   where: {
//       //     orphanage: {
//       //       orphanageid: req.params.id
//       //     }
//       //   }
//       // });

//     console.log("Orphanage deleted");

//     res.status(200).json({
//       success: true,
//       message: 'Orphanage deleted successfully.'
//     });
//   } catch (error) {
//     console.error('Database query failed:', error);
//     res.status(500).json({
//       success: false,
//       message: 'An error occurred while deleting orphanage.'
//     });
//   }
// }

// module.exports = {
//   deleteOrphanage
// };
