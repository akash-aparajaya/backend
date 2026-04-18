import twilio from 'twilio';
// import 'dotenv/config'; // Ensures environment variables are loaded

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

/**
 * Sends an SMS using Twilio
 * @param {string} to - Recipient phone number (e.g., +1234567890)
 * @param {string} message - The text body
 */
export const sendSMS = async (to, message) => {
  try {
    // Debugging: This will show in your terminal if the phone number is missing
    if (!process.env.TWILIO_PHONE_NUMBER) {
      throw new Error("TWILIO_PHONE_NUMBER is missing in .env file");
    }

    const res = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to
    });
console.log("Twilio Response:", res); // Debugging: Log the full response from Twilio
    return {
      success: true,
      sid: res.sid
    };
  } catch (error) {
    console.error("Twilio Error:", error.message);
    return {
      success: false,
      error: error.message
    };
  }
};