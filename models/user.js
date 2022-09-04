import mongoose from 'mongoose';
const db = mongoose.connection.useDb("user-db");

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        trim: true,
    }
}, {
    timestamps: true,
});


const User = db.model("User", userSchema);
export default User;