const bcrypt = require('bcrypt');
const ROLES_LIST = require('../config/roles_list');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const handleLogin = async (req, res) => {
    const { email, password } = req.body;

    // Validate request
    if (!email || !password) return res.status(400).json({ 'message': 'Email and password are required.' });

    try {
        // Query user from database
        const user = await prisma.users.findUnique({
            where: {
                email: email,
            },
        });

        if (!user) {
            return res.sendStatus(401); // Unauthorized if user not found
        }

        // Compare passwords
        const match = await bcrypt.compare(password, user.password);

        if (match) {
            const roles = user.roles ? Object.values(user.roles) : []; // Ensure roles exist and are an array

            // Create access token
            let accessToken;
            let RelevetOrphanage;

            if (!roles.includes(ROLES_LIST.Admin) && roles.includes(ROLES_LIST.Head)) {
                RelevetOrphanage = await prisma.orphanage.findUnique({
                    where: {
                        headid: user.userid
                    },
                    select: {
                        orphanageid: true
                    }
                })
            }
            else if (!roles.includes(ROLES_LIST.Admin) && roles.includes(ROLES_LIST.SocialWorker)) {
                RelevetOrphanage = await prisma.socialworker.findUnique({
                    where: {
                        socialworkerid: user.userid
                    },
                    select: {
                        orphanageid: true
                    }
                })
            }
            else if (!roles.includes(ROLES_LIST.Admin) && roles.includes(ROLES_LIST.Staff)) {
                RelevetOrphanage = await prisma.staff.findUnique({
                    where: {
                        staffid: user.userid
                    },
                    select: {
                        orphanageid: true
                    }
                })
            }
            else RelevetOrphanage = null;

            accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "userId": user.userid,
                        "username": user.username,
                        "roles": roles,
                        "orphanageid": RelevetOrphanage?.orphanageid
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15min' }
            );

            // Create refresh token
            const refreshToken = jwt.sign(
                { "email": user.email },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '1d' }
            );

            // Update refresh token in database
            await prisma.users.update({
                where: {
                    userid: user.userid,
                },
                data: {
                    refreshtoken: refreshToken,
                },
            });

            // Set refresh token in cookie
            res.cookie('jwt', refreshToken, {
                httpOnly: true,
                sameSite: 'None',
                secure: true, // Set to true in production for HTTPS only
                maxAge: 24 * 60 * 60 * 1000 // 1 day
            });

            // Respond with access token and roles
            res.json({ accessToken });
        } else {
            res.sendStatus(401); // Unauthorized if password doesn't match

        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ 'message': 'Internal Server Error' }); // Internal server error on catch
    }
};

module.exports = { handleLogin };
