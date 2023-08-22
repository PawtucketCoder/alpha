import { config } from "dotenv";
import { ServerClient } from "postmark";

// Load environment variables from .env file
config();

// Set up the Postmark client with your API key
const serverToken = process.env.POSTMARK_API_KEY;
const client = new ServerClient(serverToken);

/**
 * Generates a random 6-digit number between 100000 and 999999.
 */
const generateRandomCode = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

/**
 * Sends an email with a random code using Postmark.
 */
export async function handler(event) {
    try {
      const requestBody = JSON.parse(event.body);
      const email = requestBody.email;
  
      const randomCode = generateRandomCode();
  
      const htmlBody = `
        <h1>Welcome to our service!</h1>
        <p>Please use the following 6-digit code to confirm your email address:</p>
        <p style="font-size: 24px; font-weight: bold;">${randomCode}</p>
        <p>Enter this code in our application to complete the email confirmation process.</p>
        <p>If you didn't request this email, you can safely ignore it.</p>
        <p>Best regards,<br>Your Service Team</p>
      `;
  
      const result = await client.sendEmail({
        From: process.env.FROM_EMAIL,
        To: email, // Use the email from the form data
        Subject: "Email Confirmation",
        HtmlBody: htmlBody,
        MessageStream: "outbound"
      });
  
      console.log("Email sent successfully:", result);
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Email sent successfully" })
      };
    } catch (error) {
      console.error("Error sending email:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Error sending email" })
      };
    }
  }
  