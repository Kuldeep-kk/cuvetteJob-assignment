import { NextResponse } from "next/server";
import nodemailer from 'nodemailer';
import * as handlebars from "handlebars";

import { jobopp } from "@/app/components/jobopp";

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
    const { emails, jobTitle, experience } = await request.json(); // Expecting job details

    console.log(emails,jobTitle,experience,"--------mailing")


    try {
        const htmlBody = await compileMailTemplate(jobTitle, experience);
        const mailInfo = await transporter.sendMail({
            from: `"Cuvette Demo" <${semail}>`,
            to: emails,
            html: htmlBody,
        });

    } catch (e) {
        console.log(`Failed to send email: ${e.message}`);
        
    }

    return NextResponse.json({ success: true, results });
}

export async function compileMailTemplate(jobTitle, experience) {
    const template = handlebars.compile(jobopp);
    const htmlBody = template({
        jobTitle: jobTitle,
        experience: experience,
        
    });
    return htmlBody;
}
