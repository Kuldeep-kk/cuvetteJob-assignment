# Cuvette Job Recruiter Portal

This project is a job recruitment platform where recruiters can sign up, post jobs, and send emails to potential candidates. It features secure user authentication with OTP, JWT-based session management, protected routes, and email functionality using Nodemailer.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Project](#running-the-project)
- [API Endpoints](#api-endpoints)
- [Troubleshooting](#troubleshooting)

## Features

1. **Signup with OTP:**
   - Collects name, phone number, email, company email, and company size.
   - Sends OTP via **Twilio** (SMS) and **Nodemailer** (email) for verification.
   - Generates JWT token upon successful signup for session management.

2. **Signin with OTP:**
   - Sends an OTP to the user's email on login.
   - Allows access to the platform after successful OTP verification.

3. **Home Page:**
   - Displays a top navigation bar showing the logged-in user's name and a dropdown for logging out.
   - A side navigation bar allows navigation through different sections like the interview page and job postings.

4. **Protected Routes:**
   - Middleware ensures only authenticated users can access protected routes.
  
5. **Post Jobs and Notify Students:**
   - The recruiter can create job postings.
   - After posting a job, emails are automatically sent to students notifying them about the new job.

## Tech Stack

- **Frontend:** Next.js (React framework)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (or any other you configure)
- **Authentication:** JWT, Twilio (SMS), Nodemailer (Email)
- **Styling:** CSS, Tailwind CSS (if used)
  
## Installation

Follow these steps to get the project running on your local machine.

### Prerequisites

Make sure you have the following installed:

- **Node.js** (v14.x or later) - [Download Node.js](https://nodejs.org/)
- **npm** or **yarn**
- **Twilio account** for SMS OTP - [Twilio Signup](https://www.twilio.com/)
- **Nodemailer configuration** for email OTP

### Step 1: Clone the Repository

Clone this repository to your local machine using:

```bash
git clone https://github.com/your-username/cuvette-job-recruiter-portal.git
