import nodemailer from "nodemailer";

const createTransporter = async () => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: process.env.NODEMAILER_USER,
            pass: process.env.NODEMAILER_PASS,
        }
    });
    return transporter;
}

const sendMail = async (transporter, to, subject, html) => {
    const info = await transporter.sendMail({
        from: '"Fred Foo 👻" <abhishekku20022002@gmail.com>', // sender address
        to, // list of receivers
        subject, // Subject line
        text: "Hello world?", // plain text body
        html, // html body
      });
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

export {
    createTransporter,
    sendMail
}