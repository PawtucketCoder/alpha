// Importing necessary libraries and modules
import { config } from "dotenv";              // For loading environment variables
import { ServerClient } from "postmark";      // For interacting with Postmark (email service)
import bcrypt from "bcrypt";                  // For cryptographic functions, specifically hashing here
import mysql from "mysql2/promise";           // For interacting with MySQL database

// Load environment variables from a .env file
config();

// Database configuration using environment variables
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
};

// Setup Postmark client using the provided API key from environment variables
const serverToken = process.env.POSTMARK_API_KEY;
const client = new ServerClient(serverToken);

// Asynchronous handler function for confirming email
export async function handler(event) {
  try {
    // Parse the incoming request body
    const requestBody = JSON.parse(event.body);
    const email = requestBody.email;
    const code = requestBody.code;

    // Establish a connection to the MySQL database
    const connection = await mysql.createConnection(dbConfig);

    // Query the Users table to check if a user exists with the provided email address
    const [rows] = await connection.execute("SELECT * FROM users WHERE email = ?", [email]);
    
    // If user doesn't exist, return an error
    if (rows.length === 0) {
      await connection.end();
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "User not found with this email address" }),
      };
    }

    // If user exists, retrieve their details
    const user = rows[0];

    // Compare the provided code against the stored hash in the database
    const codeMatches = await bcrypt.compare(code.toString(), user.email_code);
    
    // If the code doesn't match, return an error
    if (!codeMatches) {
      await connection.end();
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid confirmation code" }),
      };
    }

    // If the code is correct, update the user's email confirmation status in the database
    await connection.execute("UPDATE users SET email_confirmed = 1 WHERE email = ?", [email]);

    // Close the database connection
    await connection.end();

    // Return a success message
    return {
      statusCode: 200,
      headers: {
        'Location': '/sign-in.html', // Add this line for redirection to the root
        // Add other headers here
      },
      body: JSON.stringify({ message: "Email confirmed successfully" }),
    };
    
  } catch (error) {
    // If there's an error at any point, log it and return an error response
    console.error("Error confirming email:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error confirming email" }),
    };
  }
}
