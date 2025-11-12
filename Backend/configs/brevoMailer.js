import axios from "axios";

export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: { name: "kojing", email: process.env.SENDER_EMAIL },
        to: [{ email: to }],
        subject,
        htmlContent: html,
        textContent: text,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Email sent successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Email send failed:", error.response?.data || error.message);
    throw error;
  }
};
