// Import required dependencies
import bcrypt from "bcrypt";
import mysql from "mysql2/promise";
import jwt from 'jsonwebtoken';

// Load environment variables from .env file
import { config } from "dotenv";
config();

// Configure database settings from environment variables
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
};

// Main function to handle incoming HTTP requests
export async function handler(event) {
  try {
    // Parse the incoming request data
    const { email, password } = JSON.parse(event.body);

    // Connect to the MySQL database
    const connection = await mysql.createConnection(dbConfig);

    // Find the user in the database
    const [rows] = await connection.execute("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0) {
      await connection.end();
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "User not found" }),
      };
    }

    // Check the password
    const user = rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      await connection.end();
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "Invalid password" }),
      };
    }

// ...
if (passwordMatch) {
    // Close the database connection
    await connection.end();
  
    // Create JWT payload
    const payload = {
      id: user.id,
      email: user.email,
    };
  
    // Generate JWT token
    const secret = process.env.JWT_SECRET;
    const token = jwt.sign(payload, secret, { expiresIn: '1d' });
  
    return {
      statusCode: 200,
      headers: {
        'Set-Cookie': `token=${token}; SameSite=Strict; path=/`,
        'Location': '/', // Add this line for redirection to the root
        // Add other headers here
      },
      body: JSON.stringify({ message: "Successfully signed in" }),
    };
  }
  // ...

      // Generate JWT
    const payload = {
      id: user.id,
      name: user.name // Assuming 'name' is a column in your users table
    };
    const secret = process.env.JWT_SECRET; // Add this to your environment variables
    const token = jwt.sign(payload, secret, { expiresIn: '1d' });

    // Close the database connection
    await connection.end();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Successfully signed in",
        token: token  // This is the token you can set in a cookie on the client-side
      }),
    };
  } catch (error) {
    // Handle any errors
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error signing in" }),
    };
  }
}
