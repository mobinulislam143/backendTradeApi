const nodemailer=require('nodemailer');
require("dotenv").config()
let pass = process.env.SMTP_PASS
let smtpTransport = require("nodemailer-smtp-transport");

const EmailSend=async (EmailTo,EmailText,EmailSubject)=>{

<<<<<<< HEAD
    let transporter = nodemailer.createTransport(
        smtpTransport ({
                service: "Gmail",
                auth: {
                    user: "mobinulislammahi@gmail.com",
                    pass: pass
                },
            }
        )
    );
    
    let mailOptions = {
        from:'Trade Mark <mobinulislammahi@gmail.com>',
=======
    let transporter = nodemailer.createTransport({
        host: 'smtp-mail.outlook.com',
        port: 587,
        secure:false,
        auth:{
            user: 'mobinulislammahi@outlook.com',
            pass: '1714525829mahi',
        },
        tls: {
            rejectUnauthorized: false,
        }
    })
    
    let mailOptions = {
        from:'Mern E- commerce Solution <mobinulislammahi@outlook.com>',
>>>>>>> 05537eb10f6eee5e5c20064d3cd91f29c0010339
        to: EmailTo,
        subject: EmailSubject,
        text:EmailText,
    }
    return await transporter.sendMail(mailOptions);
}

<<<<<<< HEAD

module.exports=EmailSend;
// ydtb ztch fzfs rbkj 
=======
module.exports=EmailSend;
>>>>>>> 05537eb10f6eee5e5c20064d3cd91f29c0010339
