import { NextResponse } from "next/server";
import nodemailer from 'nodemailer';
import * as handlebars from "handlebars";
import { welcomeTemplate } from "@/app/components/welcome";
import { otptemp } from "@/app/components/otptemp";

const semail = process.env.EMAIL;
const pass = process.env.EMAIL_PASS;

const accountSid = process.env.ACCOUNTSID;
const authToken = process.env.AUTHTOKEN;

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: semail,
        pass: pass,
    },
});

export const POST = async (request) => {
    const { phone, email, otp } = await request.json();
    console.log(phone, email);

    try {
        const htmlBody = await compileMailTemplate(otp);
        
        // Send email
        const mailInfo = await transporter.sendMail({
            from: `"Cuvette Demo" <${semail}>`,
            to: email,
            subject: "OTP Verification",
            html: htmlBody,
        });

        console.log(`Email sent: ${mailInfo.messageId}`);

        // Send SMS
        const client = require('twilio')(accountSid, authToken);
        const smsInfo = await client.verify.v2.services("VA9fb39ea42d552c7388de337cf24836af")
            .verifications
            .create({ to: `+91${phone}`, channel: 'sms' });

        console.log(`SMS sent: ${smsInfo.sid}`);

        // Check if both operations were successful
        if (mailInfo && smsInfo) {
            return NextResponse.json({ success: true, message: "Both OTP email and SMS sent successfully." });
        } else {
            return NextResponse.json({ success: false, message: "Failed to send OTP email or SMS." });
        }

    } catch (e) {
        console.log(e);
        return NextResponse.json({ success: false, message: e.message });
    }
}

export async function compileMailTemplate(otp) {
    const template = handlebars.compile(otptemp);
    const htmlBody = template({
        otp: otp,
    });
    return htmlBody;
}
