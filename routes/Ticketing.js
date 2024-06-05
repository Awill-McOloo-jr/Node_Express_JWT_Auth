const router = require('express').Router();
const nodemailer = require('nodemailer');
const Ticket = require('../models/Ticket')
const authorize = require('../middlewares/authorize');
const { createPDF } = require('../middlewares/pdf');


//configure nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }
})


//function to send email
const sendEmail = (to, subject, text,attachments) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: subject,
        text: text,
        attachments: attachments
    }

    return transporter.sendMail(mailOptions)
}


//Route to generate a ticket and send email
router.post('/ticketing',authorize(['admin']) ,async (req,res) => {
    try {
        const { title, description, userEmail } = req.body;
        const ticket = {
            title,
            description,
            userEmail,
            createdBy: req.user.name
        }

        const newTicket = await Ticket.create(ticket)

        const invoice = createPDF

        //send email
        await sendEmail(
            userEmail,
            'Test Email',
            `Ticket Title: ${title} \nTicket Description: ${description}`,
            [
                {
                    filename: 'invoice.pdf',
                    content: invoice
                }
            ]
        )

        res.status(201).json({message: "Ticket generated and email sent", newTicket})
    } catch (error) {
        console.error("Error generating ticket", error)
        res.status(500).json({Error: "Internal server error"})
    }
}) 
router.get('/all-tickets', authorize(['admin']), async (req,res) => {
    try {
        const tickets = await Ticket.find({createdBy: req.user.name})
        res.status(200).json(tickets)
    } catch (error) {
        res.status(400).json({error: error})
    }
})


module.exports = router;