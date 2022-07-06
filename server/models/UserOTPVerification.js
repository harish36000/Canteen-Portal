const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserOTPVerificationSchema = new Schema({
	userId: String,
    otp: String,
    createdAt: Date,
    expiresAt: Date
});

module.exports = UserOTPVerification = mongoose.model("UserOTPVerification", UserOTPVerificationSchema);
