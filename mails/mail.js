const nodeMailer = require('nodemailer')


const sendEmail = (user) => {
    console.log("------NODEMAILER------")
    console.log(user)

    const transporter = nodeMailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'habiblikanan@gmail.com',
          pass: 'iostream14'
        }
    });

    const mailOptions = {
        from: 'habiblikanan@gmail.com',
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