import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  Email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  // We store all possible temporary fields for both client and worker here
  Role: { type: String }, // 'worker' or 'client'
  First_Name: { type: String },
  Last_Name: { type: String },
  Name: { type: String },
  City: { type: String },
  Address: { type: String },
  Profession: { type: String },
  Password: { type: String },
  Profile_Pic: { type: String },
  Profile_Pic_PublicId: { type: String },
  
  // TTL index to automatically delete the document after 5 minutes
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300 // 300 seconds = 5 minutes
  }
});

// Since the same email might try to sign up multiple times without verifying,
// we don't necessarily make Email unique in this temp schema. Or we can overwrite it.

const Otp_schema = mongoose.model("Otp_DB", otpSchema);
export default Otp_schema;
