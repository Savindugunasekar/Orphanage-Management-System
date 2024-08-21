const bcrypt = require('bcrypt');
const db = require('../config/dbConn');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const handleNewUser = async (req, res) => {
    const { username, password, telno, email } = req.body;

    // Validate required fields
    if (!username || !password || !email || !telno) {
        return res.status(400).json({ 'message': 'All fields are required.' });
    }

    try {
        // Check if user already exists
        const user = await prisma.users.findUnique({
            where: {
                email: email
            }
        });

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        let result;
        if (!user) {
            // Insert new user
            result = await prisma.users.create({
                data: {
                    username: username,
                    password: hashedPassword,
                    email: email,
                    telno: +telno, // Convert to integer otherwise query will fail
                    roles: { 'User': 1010 }
                }
            });
            res.status(201).json({ 'success': `New user ${username} created!` });
        } else {
            // Update existing user
            result = await prisma.users.update({
                where: {
                    email: email
                },
                data: {
                    username: username,
                    password: hashedPassword,
                    telno: +telno // Convert to integer otherwise query will fail
                }
            });
            res.status(200).json({ 'success': `User ${username} updated!` });
        }

        console.log(result);
    } catch (error) {
        res.status(500).json({ 'message': error.message });
    }
};

module.exports = { handleNewUser };
