import { NextResponse } from "next/server";
import nodemailer from 'nodemailer';
import * as handlebars from "handlebars";

import { otptemp } from "@/app/components/otptemp";

const semail = process.env.EMAIL;
const pass = process.env.EMAIL_PASS;
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: semail,
        pass: pass,
    },
});

export const POST = async (request) => {
    const { email, otp } = await request.json();
   
    

    try {
        const htmlBody = await compileMailTemplate(otp);
        
        
        const mailInfo = await transporter.sendMail({
            from: `"Cuvette Demo" <${semail}>`,
            to: email,
            subject: "OTP Verification",
            html: htmlBody,
        });

        console.log(`Email sent: ${mailInfo.messageId}`);

            return NextResponse.json({ success: true, message: "Failed to send OTP email or SMS." });
        

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
