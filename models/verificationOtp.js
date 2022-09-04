import mongoose from "mongoose";
const db = mongoose.connection.useDb("user-db");

const verificationOtpSchema = mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    verificationOtp: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

const VerificationOtp = db.model("VerificationOtp", verificationOtpSchema);
export default VerificationOtp;