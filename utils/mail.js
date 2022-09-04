import nodemailer from "nodemailer";
import { google } from "googleapis";

export const createTransporter = async() => {

    return nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: "keerthanapalepu0810@gmail.com",
            pass: process.env.EMAIL_PASSWORD
        },
    });
};

export const emailVerificationTemplate = (firstName, verificationOtp) => {
    return `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    
    <body>
        <center>
            <h1>hi ${firstName}</h1>
            <p>Here is your otp </p>
            <h2><strong>${verificationOtp}</strong></h2>
        </center>
    </body>
    
    </html>
    `;
};
export const forgotPassword = (firstName) => {
    return `<!DOCTYPE html>
  <html lang="en">
  
  <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
  </head>
  
  <body>
      <center>
          <h1>hi ${firstName}</h1>
          <p>Here is your link </p>
      </center>
  </body>
  
  </html>
  `;
};