import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const emailController = {
  sendEmail: async (req, res) => {
    const { senderEmail, senderName, recipientEmail, subject, message } = req.body;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: `"${senderName}" <${senderEmail}>`, // Display name and email of tenant
      to: recipientEmail, // Landlord's email
      subject: subject,
      text: `Message from ${senderName} (${recipientEmail}):\n\n${message}`
    };

    // Log the mailOptions object for debugging
    console.log('Mail options:', mailOptions);

    try {
      await transporter.sendMail(mailOptions);
      res.status(200).send('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).send('Email sent successfully');
    }
  }
};

export default emailController;
