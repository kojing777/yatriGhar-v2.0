import nodemailer from "nodemailer";

// Create a test account or replace with real credentials.
// Transport configuration: adjust host/port/auth from env variables.
// If you're using Brevo (Sendinblue), ensure SMTP_USER and SMTP_PASS are set in Render.
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp-relay.brevo.com",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false, // use STARTTLS on port 587
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    // connection/timeouts help avoid very long hangs
    connectionTimeout: Number(process.env.SMTP_CONNECTION_TIMEOUT) || 20000,
    greetingTimeout: Number(process.env.SMTP_GREETING_TIMEOUT) || 15000,
    socketTimeout: Number(process.env.SMTP_SOCKET_TIMEOUT) || 20000,
    // TLS options - sometimes required on cloud hosts
    tls: {
        // Allow self-signed certs; set to true in strict production if you know the provider certs
        rejectUnauthorized: process.env.SMTP_REJECT_UNAUTHORIZED !== 'false'
    }
});

export default transporter;