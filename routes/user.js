import express from "express";
import {
  Login,
  register,
  verifyEmail,
  resetPassword,
} from "../controller/user.js";
const router = express.Router();

router.post("/login", Login);
router.post("/verifyemail", verifyEmail);
router.post("/register", register);
router.post("/forgotpassword", resetPassword);
export default router;
