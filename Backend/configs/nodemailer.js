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
// Use port 465 (SSL) if SMTP_PORT is set to 465, otherwise use 587 (TLS)
const smtpPort = parseInt(process.env.SMTP_PORT) || 587;
const useSSL = smtpPort === 465;

const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: smtpPort,
    secure: useSSL, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS, // This should be your SMTP key, not account password
    },
    requireTLS: !useSSL, // Force TLS for port 587, not needed for SSL port 465
    connectionTimeout: 10000, // 10 seconds connection timeout
    greetingTimeout: 10000, // 10 seconds greeting timeout
    socketTimeout: 10000, // 10 seconds socket timeout
    tls: {
        // Do not fail on invalid certs
        rejectUnauthorized: false,
        // Additional TLS options for better compatibility
        minVersion: 'TLSv1.2'
    },
    pool: true, // Use connection pooling
    maxConnections: 1,
    maxMessages: 100,
    debug: process.env.NODE_ENV === 'development', // Enable debug in development
    logger: process.env.NODE_ENV === 'development' // Log in development
});

// Verify transporter configuration (non-blocking, async)
// This runs in the background and won't block server startup
transporter.verify(function (error, success) {
    if (error) {
        console.error('❌ Nodemailer transporter verification failed:');
        console.error('   - Error:', error.message);
        console.error('   - Error code:', error.code);
        
        // Provide specific guidance based on error type
        if (error.code === 'ETIMEDOUT' || error.message.includes('timeout')) {
            console.error('   - Connection timeout detected');
            console.error('   - This might be due to:');
            console.error('     1. Port 587 is blocked by your hosting provider');
            console.error('     2. Network/firewall restrictions');
            console.error('     3. Try setting SMTP_PORT=465 in your .env file to use SSL');
        } else if (error.code === 'EAUTH') {
            console.error('   - Authentication failed');
            console.error('   - Check your SMTP_USER and SMTP_PASS environment variables');
            console.error('   - Ensure SMTP_PASS is your Brevo SMTP key (not account password)');
        } else if (error.code === 'ECONNREFUSED') {
            console.error('   - Connection refused');
            console.error('   - Check if smtp-relay.brevo.com is accessible');
            console.error('   - Verify your network/firewall settings');
        }
        
        console.error('   - Verify your Brevo account has email credits');
        console.error('   - Emails will still be attempted but may fail');
    } else {
        console.log('✅ Nodemailer transporter is ready to send emails');
        console.log(`   - Using port ${smtpPort} with ${useSSL ? 'SSL' : 'TLS'}`);
    }
});

export default transporter;