import { User } from "@/app/models/user";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
export const POST = async (request) => {
    const { email } = await request.json(); // Expecting companyEmail for sign-in

    try {
        // Find user by email
        const user = await User.findOne({ companyEmail:email });
        
        if (!user) {
            return NextResponse.json({
                message: "User not found!",
                status: false
            }, { status: 404 });
        }

        // Create JWT token
        const token = jwt.sign({
            _id: user._id,
            companyEmail: user.companyEmail
        }, process.env.JWT_KEY, { expiresIn: '30d' });

        // Initialize the response
        const response = NextResponse.json({
            message: "Sign in successful!",
            user: { ...user.toObject()}, 
        }, { status: 200 });

        // Set the token in cookies
        response.cookies.set("tokenForCuvette", token, {
            maxAge: 30 * 24 * 60 * 60, // 30 days
            httpOnly: true,
            secure: true,
            path: '/'
        });

        return response;

    } catch (e) {
        console.log(e);
        return NextResponse.json({
            message: "Failed to sign in!",
            status: false,
        }, { status: 500 });
    }
}