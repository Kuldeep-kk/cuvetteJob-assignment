import { NextResponse } from "next/server";

const accountSid = process.env.ACCOUNTSID;
const authToken = process.env.AUTHTOKEN;

export const POST = async (request) => {

    const { phone, code } = await request.json();
    console.log("-------------",phone,code)
  
    try {
        const client = require('twilio')(accountSid, authToken);

        const verificationCheck = await client.verify.v2.services("VA9fb39ea42d552c7388de337cf24836af")
            .verificationChecks
            .create({ to: `+91${phone}`, code });

        // Check the status of the verification
        if (verificationCheck.status === "approved") {
            return NextResponse.json({ status: true });
        } else {
            return NextResponse.json({ status: false });
        }
    } catch (e) {
        console.log(e);
        return NextResponse.json({ success: false, error: e.message });
    }
};
