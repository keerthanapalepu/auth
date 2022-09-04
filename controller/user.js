import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserModal from '../models/user.js';
import VerificationOtp from '../models/verificationOtp.js';
import otpGenerator from "otp-generator";
import validator from 'validator';
import mongoose from 'mongoose';
import {
    createTransporter,
    emailVerificationTemplate,
    forgotPassword
} from "../utils/mail.js";
const secret = 'test';

export const Login = async(req, res) => {
    const { email, password } = req.body;

    try {
        const oldUser = await UserModal.findOne({ email });
        if (!oldUser) return res.status(404).json({ message: "User doesn't exist" });
        const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);
        if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });
        const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, { expiresIn: "1h" });
        res.status(200).send({ result: oldUser, token });
    } catch (err) {
        res.status(500).send({ message: "Something went wrong" });
    }
};



export const register = async(req, res) => {
    const { email, password, firstName, lastName } = req.body;

    try {
        const User = await UserModal.findOne({ email });
        if (User) {
            return res.status(403).send({
                error: "Account with given email already exists! Login to continue",
            });
        }

        const isValidFirstName = !validator.isEmpty(firstName, {
            ignore_whitespace: true,
        });
        if (!isValidFirstName) {
            return res.status(400).send({ error: "Invalid First Name!" });
        }
        const isValidLastName = !validator.isEmpty(lastName, { ignore_whitespace: true });
        if (!isValidLastName) {
            return res.status(400).send({ error: "Invalid Last Name!" });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = new UserModal({
            email,
            firstName,
            lastName,
            password: hashedPassword
        });
        await newUser.save();

        let otpGenerated = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });

        const hashedOTP = await bcrypt.hash(otpGenerated, 12);
        const newVerificationOtp = new VerificationOtp({
            owner: newUser._id,
            verificationOtp: hashedOTP,
        });
        await newVerificationOtp.save();

        const mailOptions = {
            from: `Overpay <${process.env.Email}>`,
            to: newUser.email,
            subject: "Email Verification OTP",
            html: emailVerificationTemplate(newUser.firstName, otpGenerated),
        };

        const transporter = await createTransporter();
        const mail = await transporter.sendMail(mailOptions);

        res.status(201).send({ user: newUser });
    } catch (error) {
        console.log(error);
        res.status(400).send({ error: "Invalid email or password" });
    }
};

export const verifyEmail = async(req, res) => {
    const { userId, userVerificationOtp } = req.body;
    try {
        const newUser = await UserModal.findById(userId);
        const dbVerificationOtp = await VerificationOtp.findOne({
            owner: userId,
        });
        const isOTPCorrect = await bcrypt.compare(userVerificationOtp, dbVerificationOtp.verificationOtp);
        if (!isOTPCorrect) return res.status(400).json({ message: "Invalid OTP" });

        await VerificationOtp.findByIdAndDelete(dbVerificationOtp._id);

        const token = jwt.sign({ email: newUser.email, id: newUser._id }, secret, { expiresIn: "1h" });
        res.status(200).send({ result: newUser, token });
    } catch (error) {
        res.status(400).send({ error: "Invalid User" });
    }
};

export const forgotPassword = async(req, res) => {
    const { email } = req.body;
    try {
        const oldUser = await UserModal.findOne({ email });
        if (!oldUser) return res.status(404).json({ message: "User doesn't exist" });
        const mailOptions = {
            from: `Overpay <${process.env.Email}>`,
            to: oldUser.email,
            subject: "Email Verification OTP",
            html: forgotPassword(oldUser.firstName),
        };

        const transporter = await createTransporter();
        const mail = await transporter.sendMail(mailOptions);
        res.status(200).send("resent link sent successfully");
    } catch (error) {
        res.status(400).send({ error: "Invalid User" });
    }
};