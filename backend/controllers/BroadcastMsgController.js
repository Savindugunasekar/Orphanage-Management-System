const db = require("../config/dbConn");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const sendBroadcastMsg = async (req, res) => {
  let { massage, selectedGroup } = req.body;
  massage = "Sent by Authority : " + massage;
  try {
    const newBroadcastMessage = await prisma.broadcastmassages.create({
      data: {
        message: massage,
        role: selectedGroup,
      },
    });

    res.status(201).json({
      message: "Broadcast message sent successfully!",
      newBroadcastMessage,
    });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({
      message: "Error sending message",
      error: error.message,
    });
  }
};

const getBroadcastMsg = async (req, res) => {
  try {
    const broadcastMessages = await prisma.broadcastmassages.findMany();
    res.json({
      success: true,
      broadcastMessages,
    });
  } catch (error) {
    console.error("Database query failed:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching broadcast messages.",
    });
  }
};

module.exports = { sendBroadcastMsg, getBroadcastMsg };
