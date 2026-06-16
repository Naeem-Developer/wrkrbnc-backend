import Otp_schema from '../models/otp_schema.js';
import Client_schema from "../models/client_schema.js";

const varify_OTP_client = async (req, resp) => {
    const { Email, otp } = req.body;

    try {
        const data = await Otp_schema.findOne({ Email });

        if (!data || data.Role !== 'client') {
            return resp.status(400).json({ message: 'OTP expired or invalid', success: false });
        }

        if (data.otp !== otp) {
            return resp.status(400).json({ message: 'Invalid OTP', success: false });
        }
       
        const { Name, City, Address, Password } = data;

        const newClient = new Client_schema({
            Name,
            Email,
            City,
            Address,
            Password,
            isVerified: true,
        });

        await newClient.save();
        await Otp_schema.deleteOne({ _id: data._id });
        return resp.status(200).json({ message: 'User Created Successfully', success: true });
        
    } catch (error) {
        console.error('Client OTP Verification Error:', error);
        return resp.status(500).json({ message: 'Internal server error', success: false });
    }
};

export default varify_OTP_client;
