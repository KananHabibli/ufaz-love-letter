const nodeMailer = require('nodemailer')


const sendEmail = (user) => {
    console.log("------NODEMAILER------")
    console.log(user)

    const transporter = nodeMailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'loveletterufaz@gmail.com',
          pass: 'love-letter-ufaz'
        }
    });

    const mailOptions = {
        from: 'loveletterufaz@gmail.com',
        to: user.email,
        subject: 'Love Letter Registration',
        text: `Welcome to Love Letter, ${user.username}!`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}

module.exports = sendEmail