import nodemailer from "nodemailer";

// Validate environment variables
if (!process.env.SMTP_USER) {
    console.error('⚠️ SMTP_USER environment variable is not set');
}

if (!process.env.SMTP_PASS) {
    console.error('⚠️ SMTP_PASS environment variable is not set');
}

if (!process.env.SENDER_EMAIL) {
    console.error('⚠️ SENDER_EMAIL environment variable is not set');
}

// Create transporter with proper Brevo SMTP configuration
const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS, // This should be your SMTP key, not account password
    },
    requireTLS: true, // Force TLS
    tls: {
        // Do not fail on invalid certs
        rejectUnauthorized: false
    },
    debug: process.env.NODE_ENV === 'development', // Enable debug in development
    logger: process.env.NODE_ENV === 'development' // Log in development
});

// Verify transporter configuration
transporter.verify(function (error, success) {
    if (error) {
        console.error('❌ Nodemailer transporter verification failed:');
        console.error('   - Error:', error.message);
        console.error('   - Check your SMTP_USER and SMTP_PASS environment variables');
        console.error('   - Ensure SMTP_PASS is your Brevo SMTP key (not account password)');
        console.error('   - Verify your Brevo account has email credits');
    } else {
        console.log('✅ Nodemailer transporter is ready to send emails');
    }
});

export default transporter;