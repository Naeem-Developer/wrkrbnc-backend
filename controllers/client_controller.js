import Client_schema from "../models/client_schema.js";
import Otp_schema from "../models/otp_schema.js";
import bcrypt from "bcryptjs";
import crypto from 'crypto';
import sgMail from '@sendgrid/mail';


// API function to create a new client

const createclient = async (req, resp) => {

    const body = { ...req.body };
    const { Name, Email, City, Address, Password } = body;
    if (!Name || !Email || !City || !Address || !Password) {
        return resp.status(400).json({ message: 'All fields are required', success: false });
    }

    try {
        const existingClient = await Client_schema.findOne({ Email });
        if (existingClient) {
            return resp.status(400).json({ message: 'Client already exists', success: false });
        }

        const otp = crypto.randomInt(100000, 999999).toString();
        const hashedPassword = await bcrypt.hash(Password, 10);

        // Remove existing OTPs for this email
        await Otp_schema.deleteMany({ Email });

        const newOtp = new Otp_schema({
            Role: 'client',
            Name,
            Email,
            City,
            Address,
            otp,
            Password: hashedPassword
        });
        await newOtp.save();

        // Send verification email
        sgMail.setApiKey(process.env.API_KEY || process.env.SENDGRID_API_KEY);

        try {
            await sgMail.send({
                to: Email,
                from: 'workerbnc@gmail.com',
                subject: 'Verify Your Email - WorkerBNC',
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
                        <div style="background-color: #4F46E5; padding: 20px; border-radius: 8px 8px 0 0; color: white;">
                            <h1 style="margin: 0;">WorkerBNC</h1>
                            <p style="margin: 5px 0 0 0; opacity: 0.9;">Email Verification</p>
                        </div>
                        
                        <div style="padding: 30px; background-color: #f9fafb; border-radius: 0 0 8px 8px;">
                            <h2 style="color: #111827; margin-top: 0;">Hello ${Name},</h2>
                            
                            <p style="color: #374151; line-height: 1.6;">
                                Thank you for signing up with WorkerBNC! Please use the OTP below to verify your email address:
                            </p>
                            
                            <div style="text-align: center; margin: 30px 0;">
                                <div style="background-color: white; border: 2px dashed #4F46E5; 
                                            padding: 20px; border-radius: 8px; display: inline-block;">
                                    <div style="font-size: 32px; font-weight: bold; color: #4F46E5; 
                                                letter-spacing: 5px;">
                                        ${otp}
                                    </div>
                                </div>
                            </div>
                            
                            <p style="color: #6B7280; font-size: 14px;">
                                This OTP will expire in 5 minutes. If you didn't request this, please ignore this email.
                            </p>
                            
                            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                                <p style="color: #9ca3af; font-size: 12px;">
                                    Need help? Contact us at support@workerbnc.com
                                </p>
                            </div>
                        </div>
                    </div>
                `
            });

            // Return success response
            return resp.status(200).json({
                message: 'Signup successful! Please check your email for the OTP.',
                success: true,
                emailSent: true
            });

        } catch (emailError) {
            console.error('sgMail API Error:', emailError);
            return resp.status(500).json({
                message: 'Failed to send verification email',
                success: false,
                error: emailError.message
            });
        }

    } catch (error) {
        console.error('Client Signup Error:', error);
        return resp.status(500).json({ message: 'Internal server error', success: false, error: error.message });
    }

}


export default createclient;
