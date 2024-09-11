const nodemailer=require('nodemailer');
require("dotenv").config()
let pass = process.env.SMTP_PASS
let smtpTransport = require("nodemailer-smtp-transport");

const EmailSend=async (EmailTo,EmailText,EmailSubject)=>{

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
        to: EmailTo,
        subject: EmailSubject,
        text:EmailText,
    }
    return await transporter.sendMail(mailOptions);
}


module.exports=EmailSend;
// ydtb ztch fzfs rbkj 