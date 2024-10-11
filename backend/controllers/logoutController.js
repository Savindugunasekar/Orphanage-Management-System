const db = require("../config/dbConn");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const handleLogout = async (req, res) => {
    try {
        const cookies = req.cookies

        if (!cookies.jwt) return res.sendStatus(204)

        const refreshToken = cookies.jwt

        const foundUser = await prisma.users.findUnique({
            where: {
                refreshtoken: refreshToken
            }
        })

        if (!foundUser) {
            res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
            return res.sendStatus(204);
        }

        userId = foundUser.userid

        await prisma.users.update({
            where: {
                userid: userId
            },
            data: {
                refreshtoken: null
            }
        })

        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        res.sendStatus(204);
    } catch (error) {
        console.log('Database query failed:');
        res.status(500).json({
            success: false,
            message: 'An error occurred while logging out.'
        });
    }


}

module.exports = { handleLogout }