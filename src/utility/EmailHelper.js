const nodemailer=require('nodemailer');

const EmailSend=async (EmailTo,EmailText,EmailSubject)=>{

    const transporter = nodemailer.createTransport({
        host: 'smtp-relay.brevo.com',
        port: 587,
        auth: {
            user: 'mobinulislammahi@gmail.com',
            pass: 'V5gpBWJFAfshG3wK'
        }
    });


    let mailOption={
         from:'MERN Ecommerce Solution <mobinulislammahi@gmail.com>',
         to:EmailTo,
         subject:EmailSubject,
         text:EmailText
    }

    return await transporter.sendMail(mailOption)
}

module.exports=EmailSend;