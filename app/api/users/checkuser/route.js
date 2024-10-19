import { getResponseMessage } from "@/app/helper/getResponseMessage";
import { User } from '@/app/models/user';
import { connectDb } from "@/app/helper/db";

connectDb();

export const PUT = async (request) => {
    const { email, phone } = await request.json(); // Destructure both email and phone

    console.log(email, phone); // Log both values

    try {
        // Check if either the email or phone number exists in the database
        const userExists = await User.findOne({ 
            $or: [
                { companyEmail: email }, // Assuming your email field is 'companyEmail'
                { phone }
            ]
        });

        if (userExists) {
            // Determine which field already exists
            const errorMessages = [];
            if (userExists.companyEmail === email) {
                errorMessages.push("Email already exists");
            }
            if (userExists.phone === phone) {
                errorMessages.push("Phone number already exists");
            }
            return getResponseMessage(errorMessages.join(", "), 200, false);
        } else {
            return getResponseMessage("Both email and phone number are unique", 200, true);
        }

    } catch (e) {
        console.log(e);
        return getResponseMessage("Failed to check email and phone number", 500, false);
    }
};
