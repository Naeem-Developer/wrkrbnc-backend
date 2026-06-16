import Worker_schema from '../models/Worker_schema.js';
import Otp_schema from '../models/otp_schema.js';

const verifyWorkerOtp = async (req, resp) => {
  const { Email, otp } = req.body;

  if (!Email || !otp) {
    return resp.status(400).json({ message: "Missing fields", success: false });
  }

  try {
    const storedData = await Otp_schema.findOne({ Email });

    if (!storedData || storedData.Role !== 'worker') {
      return resp.status(400).json({ message: "OTP expired or invalid", success: false });
    }

    // Check OTP match
    if (storedData.otp !== otp) {
      return resp.status(400).json({ message: "Incorrect OTP", success: false });
    }

    // Create worker in DB
    const newWorker = new Worker_schema({
      First_Name: storedData.First_Name,
      Last_Name: storedData.Last_Name,
      Email: storedData.Email,
      City: storedData.City,
      Address: storedData.Address,
      Profession: storedData.Profession,
      Password: storedData.Password,   // already hashed
      Profile_Pic: storedData.Profile_Pic, // CLOUDINARY URL
      Profile_Pic_PublicId: storedData.Profile_Pic_PublicId,
    });

    await newWorker.save();

    // Delete temp stored data
    await Otp_schema.deleteOne({ _id: storedData._id });

    return resp.status(200).json({
      message: "Worker verified and account created successfully!",
      success: true,
      worker: newWorker,
    });
  } catch (error) {
    console.error('Worker OTP Verification Error:', error);
    return resp.status(500).json({ message: "Server error", success: false });
  }
};

export default verifyWorkerOtp;
