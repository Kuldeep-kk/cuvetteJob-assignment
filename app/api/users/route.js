import { User } from "@/app/models/user";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const GET = async (request) => {
    let users = [];
    try {
        users = await User.find().select("-password");
        return NextResponse.json(users);
    } catch (e) {
        return NextResponse.json({
            message: "Failed to get users",
            success: "false"
        });
    }
}

export const POST = async (request) => {
    const {
        name,
        phone,
        companyName,
        companyEmail,
        employeeSize,
        isEmailVerified,
        isPhoneVerified
    } = await request.json();

    const user = new User({
        name,
        phone,
        companyName,
        companyEmail,
        employeeSize,
        emailVerified: isEmailVerified,
        phoneVerified: isPhoneVerified
    });

    console.log(user);

    try {
        const createdUser = await user.save();
        
        const token = jwt.sign({
            _id: user._id,
            companyEmail: user.companyEmail
        }, process.env.JWT_KEY);

        // Initialize the response
        const response = NextResponse.json(createdUser, {
            status: 201
        });

        // Now, set the cookies
        response.cookies.set("tokenForCuvette", token, {
            maxAge: 30 * 24 * 60 * 60 * 1000, 
            httpOnly: true,
            secure: true,
            path: '/'
        });

        return response;

    } catch (e) {
        console.log(e);
        return NextResponse.json({
            message: "Failed to create user!",
            status: false,
        });
    }
}
