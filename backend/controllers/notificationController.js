const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();


const getNotifications = async (req, res) => {
    try {
        const { userId } = req.query;

        const notifications = await prisma.users.findUnique({
            where: {
                userid: userId
            },
            select: {
                notifications: true
            }
        })


        res.json({
            success: true,
            notifications: notifications.notifications,
            userid: userId
        })

    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching notifications.",
        });

    }
}

const clearNotifications = async (req, res) => {
    try {
        const { userId } = req.body;

        await prisma.users.update({
            where: {
                userid: userId
            },
            data: {
                notifications: []
            }
        })

        res.json({
            success: true,
            message: "Notifications cleared successfully."
        })

    } catch (error) {
        console.error("Error clearing notifications:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while clearing notifications."
        })
    }
}

module.exports = {
    getNotifications,
    clearNotifications
}