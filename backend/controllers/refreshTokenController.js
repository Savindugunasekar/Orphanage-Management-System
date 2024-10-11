const jwt = require('jsonwebtoken');
const db = require('../config/dbConn');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const ROLES_LIST = require('../config/roles_list');

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.status(401).json({ 'message': 'there is no jwt cookie' })

    const refreshToken = cookies.jwt;

    const user = await prisma.users.findUnique({
        where: {
            refreshtoken: refreshToken,
        },
    });

    let orphanage;
    if (!user) return res.status(403).json({ 'message': 'There is no user with this ref token' })

    if (!Object.values(user.roles).includes(ROLES_LIST.Admin) && (Object.values(user.roles).includes(ROLES_LIST.Head))) {

        orphanage = await prisma.orphanage.findUnique({
            where: {
                headid: user.userid
            }
        })
    }
    else if (!Object.values(user.roles).includes(ROLES_LIST.Admin) && (Object.values(user.roles).includes(ROLES_LIST.SocialWorker))) {

        orphanage = await prisma.socialworker.findUnique({
            where: {
                socialworkerid: user.userid
            }
        })
    }
    else if (!Object.values(user.roles).includes(ROLES_LIST.Admin) && (Object.values(user.roles).includes(ROLES_LIST.Staff))) {

        orphanage = await prisma.staff.findUnique({
            where: {
                staffid: user.userid
            }
        })
    }

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || user.email !== decoded.email) res.sendStatus(403)

            const roles = Object.values(user.roles)

            const accessToken = jwt.sign(
                {
                    'UserInfo': {
                        "userId": user.userid,
                        "username": user.username,
                        "roles": roles,
                        "orphanageid": orphanage?.orphanageid
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15min' }
            );

            res.json({ accessToken })
        }
    )


}

module.exports = { handleRefreshToken }