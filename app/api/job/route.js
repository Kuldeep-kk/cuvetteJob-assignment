import { User } from "@/app/models/user";
import { NextResponse } from "next/server";

export const POST = async (request) => {
    const { _id, jobTitle, jobDescription, experienceLevel, addCandidate, endDate,mails } = await request.json();

    try {
        

        // Find the user by ID and push the new job post into the jobPosts array
        const updatedUser = await User.findByIdAndUpdate(
            _id,
            {
                $push: {
                    jobPosts: {
                        jobTitle,
                        jobDescription,
                        experienceLevel,
                        addCandidate: mails, // Store as an array
                        endDate,
                    }
                }
            },
            { new: true, select: { jobPosts: 1 } } // Return the updated jobPosts only
        );

        if (!updatedUser) {
            return NextResponse.json({
                message: "User not found",
                success: false
            }, { status: 404 });
        }

        return NextResponse.json({
            message: "Job post created successfully",
            success: true,
            jobPosts: updatedUser
        }, { status: 201 });
    } catch (error) {
        console.error("Error creating job post:", error);
        return NextResponse.json({
            message: "Failed to create job post",
            success: false,
        }, { status: 500 });
    }
};
