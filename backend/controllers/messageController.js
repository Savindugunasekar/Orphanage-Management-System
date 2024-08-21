const db = require("../config/dbConn");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllMessages = async (req, res) => {
    try {
        const { user, roles } = req;
        
        let allMessages = [];

        if (roles.includes(7788)) { // Admin role
            allMessages = await prisma.messages.findMany({
                where: { replied: false },
            });
        } else {
            allMessages = await prisma.messages.findMany({
                where: {
                  
                    sendername: user
                },
            });
        }

        res.json({ success: true, allMessages });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: "Failed to fetch messages" });
    }
};

const createMessage = async (req, res) => {
    try {
        const { user } = req;
        const { subject, context } = req.body;

        const newMessage = await prisma.messages.create({
            data: {
                sendername: user,
                subject: subject,
                context: context
            }
        });

        res.json({ success: true, newMessage });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: "Failed to create message" });
    }
};

const setReply = async (req, res) => {
    try {
        const { messageid, replyContext } = req.body;

        const updatedMessage = await prisma.messages.update({
            where: { messageid: messageid },
            data: {
                replied: true,
                replycontext: replyContext
            }
        });

        res.json({ success: true, message: "Reply added successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: "Failed to set reply" });
    }
};

module.exports = { getAllMessages, createMessage, setReply };
