const Stripe = require("stripe");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");


dotenv.config();

const stripe_key = process.env.STRIPE_SECRET_KEY;
const stripe = new Stripe(stripe_key);
const frontend_url = "http://localhost:3002";
const prisma = new PrismaClient(); // Initialize Prisma Client

const donate = async (req, res) => {
  try {
    const {
      amount,
      first_name,
      last_name,
      email,
      address,
      nic,
      country,
      phone,
      currency,
    } = req.body;

    // Create a single line item for donation
    const line_items = [
      {
        price_data: {
          currency: req.body.currency,
          product_data: {
            name: "Donation for the Sri Lankan Orphanages for the Children in Need",
          },
          unit_amount: amount*10,
        },
        quantity: 1,
      },
    ];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: line_items,
      mode: "payment",
      success_url: `${frontend_url}`,
      cancel_url: `${frontend_url}`,
    });

    // Save the donation data to the database
    await prisma.donation.create({
      data: {
        first_name,
        last_name,
        email,
        address,
        nic,
        country,
        phone,
        amount: parseFloat(amount), // Ensure the amount is a float
      },
    });

    // Respond with the Stripe session URL for redirection
    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error("Donation error:", error); // Log the error for debugging
    res.status(500).json({
      success: false,
      message: error.message || "Donation failed.",
    });
  } finally {
    await prisma.$disconnect(); // Close Prisma Client connection
  }
};

const getAllDonations = async (req,res) => {
  try {
    const donations = await prisma.donation.findMany();
    return res.json({donations});
  } catch (error) {
    console.error("Failed to fetch donations:", error);
  }
};

module.exports = { donate, getAllDonations };
