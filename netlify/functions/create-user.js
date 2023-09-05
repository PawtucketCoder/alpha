// Import required dependencies
import { config } from "dotenv";
import { ServerClient } from "postmark";
import bcrypt from "bcrypt";
import mysql from "mysql2/promise";
import validator from 'validator';

// Load environment variables from .env file
config();

// Configure database settings from environment variables
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
};

// Initialize Postmark email client
const serverToken = process.env.POSTMARK_API_KEY;
const client = new ServerClient(serverToken);

// Main function to handle incoming HTTP requests
export async function handler(event) {
    try {
        // Parse the incoming request data
        const { name, email, password } = JSON.parse(event.body);

        // Validate email format
        if (!validator.isEmail(email)) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Invalid email format" }),
            };
        }

        // Validate other input fields
        if (!name || !password) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Invalid input data" }),
            };
        }

        // Connect to the MySQL database
        const connection = await mysql.createConnection(dbConfig);

        // Check for existing users with the same email
        const [rows] = await connection.execute("SELECT * FROM users WHERE email = ?", [email]);
        if (rows.length > 0) {
            await connection.end();
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "User already exists with this email address" }),
            };
        }

        // Generate and encrypt a 6-digit verification code
        const randomCode = generateRandomCode();
        const encryptedRandomCode = await bcrypt.hash(randomCode.toString(), 10);

        // Encrypt the password
        const encryptedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the database
        await connection.execute("INSERT INTO users (name, email, password, email_code) VALUES (?, ?, ?, ?)", 
                                 [name, email, encryptedPassword, encryptedRandomCode]);

        // Create and send a confirmation email
        const confirmationLink = `https://localhost:8888/confirm-email.html?email=${encodeURIComponent(email)}`;
        const emailBody = `
            <h1>Welcome to our service!</h1>
            <p>Here is your 6-digit code: ${randomCode}</p>
            <a href="${confirmationLink}">Or click here to confirm your email</a>
        `;
        await client.sendEmail({
            From: process.env.FROM_EMAIL,
            To: email,
            Subject: "Email Confirmation",
            HtmlBody: emailBody,
        });

        // Close the database connection
        await connection.end();

        return {
            statusCode: 200,
            headers: {
                'Location': '/confirm-email.html', // Add this line for redirection to the root
                // Add other headers here
              },
            body: JSON.stringify({ message: "User created and email sent successfully" }),
        };
    } catch (error) {
        // Handle any errors
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Error creating user or sending email" }),
        };
    }
}

// Helper function to generate a 6-digit code
function generateRandomCode() {
    return Math.floor(100000 + Math.random() * 900000);
}
