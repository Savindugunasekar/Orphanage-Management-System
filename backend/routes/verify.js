const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Route for email verification
router.get('/', async (req, res) => {
    const { token } = req.query;
    if (!token) {
        return res.status(400).json({ message: 'Token is required.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.VERIFY_TOKEN_SECRET);
        const email = decoded.email;

        const user = await prisma.users.findUnique({
            where: {
                email: email,
            },
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid token or user not found.' });
        }

        if (user.verified) {
            return res.status(400).json({ message: 'User already verified.' });
        }

        // Update user to mark them as verified
        await prisma.users.update({
            where: {
                email: email,
            },
            data: {
                verified: true,
            },
        });

        return res.status(200).json({ message: 'Email verified successfully.' });
    } catch (error) {
        return res.status(400).json({ message: 'Invalid or expired token.' });
    }
});

module.exports = router;
