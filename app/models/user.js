import mongoose, { Schema } from "mongoose";

// Define the JobPost schema
const JobPostSchema = new Schema({
    jobTitle: {
        type: String,
        required: [true, "Job title is required"],
    },
    jobDescription: {
        type: String,
        required: [true, "Job description is required"],
    },
    experienceLevel: {
        type: String,
        required: [true, "Experience level is required"],
    },
    addCandidate: {
        type:  [String], // You can modify this type as needed
        required: [true, "Candidate addition detail is required"],
    },
    endDate: {
        type: Date,
        required: [true, "End date is required"],
    },
}, {
    timestamps: true,
});

// Define the User schema
const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"],
    },
    companyName: {
        type: String,
        required: [true, "Company name is required"],
    },
    companyEmail: {
        type: String,
        required: [true, "Company email is required"],
        match: [/.+@.+\..+/, "Please enter a valid email address"], // Optional email format validation
    },
    employeeSize: {
        type: String,
        required: [true, "Employee size is required"],
    },
    emailVerified: {
        type: Boolean,
        default: false,
    },
    phoneVerified: {
        type: Boolean,
        default: false,
    },
    jobPosts: [JobPostSchema], // Nested model for job posts
}, {
    timestamps: true,
});

// Create and export the User model
export const User = mongoose.models.User || mongoose.model("User", UserSchema);
