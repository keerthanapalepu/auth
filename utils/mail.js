import nodemailer from 'nodemailer';
import { google } from "googleapis";

export const createTransporter = async() => {
    const oAuth2Client = new google.auth.OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        process.env.REDIRECT_URI
    )
    oAuth2Client.setCredentials({
        refresh_token: process.env.REFRESH_TOKEN
    })
    const accessToken = await oAuth2Client.getAccessToken()
    return nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: process.env.EMAIL,
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN,
            accessToken
        }
    })
}

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
    `
}
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
  `
}