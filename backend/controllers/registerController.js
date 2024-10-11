// Import required modules
const { PrismaClient } = require('@prisma/client'); // For interacting with the Prisma database
const bcrypt = require('bcrypt'); // For hashing passwords
const jwt = require('jsonwebtoken'); // For creating and verifying JSON Web Tokens
const nodemailer = require('nodemailer'); // For sending emails
const express = require('express'); // For creating the Express app (if needed)

// Initialize Prisma Client
const prisma = new PrismaClient();

// Set up Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // You can change this to your email provider
    auth: {
        user: process.env.EMAIL, // Your email address
        pass: process.env.PASSWORD // Your email password or app password
    }
});
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

        const hashedPassword = await bcrypt.hash(password, 10);

        let result;
        if (!user) {
            // Check if the email is a Gmail address
            const isGmail = /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);

            if (isGmail) {
                const token = jwt.sign({ email }, process.env.VERIFY_TOKEN_SECRET, { expiresIn: '1hr' });

                const verificationUrl = `${process.env.BASE_URL}/verify?token=${token}`;

                // Send verification email
                await transporter.sendMail({
                    from: process.env.EMAIL,
                    to: email,
                    subject: 'Email Verification',
                    html: `<h1>Email Confirmation</h1>
                           <p>Click the link below to verify your email:</p>
                           <a href="${verificationUrl}">Verify Email</a>`,
                });
            }

            result = await prisma.users.create({
                data: {
                    username: username,
                    password: hashedPassword,
                    email: email,
                    telno: +telno,
                    roles: { 'User': 1010 },
                    verified: !isGmail // Set verified to false if Gmail, true otherwise
                }
            });
            res.status(201).json({ 'success': `New user ${username} created!` });
        } else if (!user.username) {
            // Update existing user
            result = await prisma.users.update({
                where: {
                    email: email
                },
                data: {
                    username: username,
                    password: hashedPassword,
                    telno: +telno,
                    verified: true
                }
            });
            res.status(200).json({ 'success': `User ${username} updated!` });
        }
        else {
            res.status(403).json({ 'message': 'User already exists.' });
        }

        console.log(result);
    } catch (error) {
        res.status(500).json({ 'message': error.message });
    }
};

module.exports = { handleNewUser };
