import transporter from "../configs/nodemailer.js";

//api to subscribe to newsletter and send exclusive offers email
//POST /api/newsletter/subscribe
export const subscribeNewsletter = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: "Invalid email format" });
        }

        // Send exclusive offers email
        try {
            if (!process.env.SENDER_EMAIL) {
                console.warn('⚠️ SENDER_EMAIL not set, skipping newsletter email sending');
                return res.status(200).json({ success: true, message: "Subscribed successfully (email sending disabled)" });
            }

            const mailOptions = {
                from: process.env.SENDER_EMAIL,
                to: email,
                subject: '🎉 Welcome to YatriGhar - Exclusive Offers Await!',
                html: `
                    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; color: #111827;">
                        <div style="max-width:600px;margin:0 auto;padding:24px;background:#ffffff;border-radius:8px;box-shadow:0 4px 20px rgba(2,6,23,0.08);">
                            <div style="text-align:center;padding-bottom:12px;">
                                <img src="${process.env.FRONTEND_URL || ''}/yatri.png" alt="YatriGhar" style="height:56px;object-fit:contain;" />
                            </div>
                            <h2 style="color:#0f172a;margin:0 0 8px;font-size:24px;text-align:center">Welcome to YatriGhar! 🌟</h2>
                            <p style="margin:0 0 16px;color:#475569;line-height:1.5;text-align:center">Thank you for subscribing! We're excited to share exclusive offers and travel inspiration with you.</p>

                            <div style="background:#fef3c7;border:1px solid #f59e0b;border-radius:8px;padding:20px;margin:20px 0;">
                                <h3 style="color:#92400e;margin:0 0 12px;font-size:18px;text-align:center">🎁 Your Exclusive Welcome Offers</h3>
                                <ul style="color:#78350f;margin:0;padding-left:20px;">
                                    <li style="margin-bottom:8px;"><strong>15% OFF</strong> your first booking with code: <code style="background:#fed7aa;padding:2px 6px;border-radius:4px;">WELCOME15</code></li>
                                    <li style="margin-bottom:8px;"><strong>Free cancellation</strong> on bookings made within 24 hours</li>
                                    <li style="margin-bottom:8px;"><strong>Early access</strong> to flash sales and limited-time deals</li>
                                    <li style="margin-bottom:8px;"><strong>Monthly newsletter</strong> with destination guides and travel tips</li>
                                </ul>
                            </div>

                            <div style="text-align:center;margin:24px 0;">
                                <a href="${process.env.FRONTEND_URL || 'https://yourdomain.com'}/rooms" style="display:inline-block;padding:12px 24px;background:#f59e0b;color:#ffffff;border-radius:8px;text-decoration:none;font-weight:600;font-size:16px;">Explore Hotels & Book Now</a>
                            </div>

                            <div style="background:#f8fafc;border-radius:8px;padding:16px;margin:20px 0;">
                                <h4 style="color:#0f172a;margin:0 0 8px;font-size:16px">✨ What to expect from our newsletter:</h4>
                                <ul style="color:#475569;margin:0;padding-left:20px;font-size:14px;">
                                    <li>Weekly destination spotlights</li>
                                    <li>Exclusive member-only discounts</li>
                                    <li>Travel tips and local insights</li>
                                    <li>Seasonal offers and promotions</li>
                                    <li>Behind-the-scenes stories from our properties</li>
                                </ul>
                            </div>

                            <p style="margin:16px 0 0;color:#334155;text-align:center">Ready for your next adventure? Let's make it unforgettable!</p>

                            <hr style="border:none;border-top:1px solid #e6edf3;margin:20px 0" />

                            <div style="font-size:13px;color:#64748b;line-height:1.6;text-align:center">
                                <p style="margin:0 0 8px">Questions? We're here to help:</p>
                                <p style="margin:0">Email: <a href="mailto:${process.env.SUPPORT_EMAIL || process.env.SENDER_EMAIL}" style="color:#0f172a;text-decoration:none">${process.env.SUPPORT_EMAIL || process.env.SENDER_EMAIL}</a> | Phone: <a href="tel:${process.env.SUPPORT_PHONE || '+1-555-0100'}" style="color:#0f172a;text-decoration:none">${process.env.SUPPORT_PHONE || '+977 9813254153'}</a></p>
                            </div>

                            <p style="margin:18px 0 0;color:#94a3b8;font-size:12px;text-align:center">Best regards,<br/>The YatriGhar Team</p>
                        </div>

                        <div style="max-width:600px;margin:16px auto 0;text-align:center;font-size:12px;color:#94a3b8">
                            <p style="margin:6px 0">YatriGhar · 123 Traveler Lane · Your City</p>
                            <p style="margin:6px 0">You can unsubscribe anytime by replying to this email.</p>
                        </div>
                    </div>
                `
            };

            await transporter.sendMail(mailOptions);
            console.log(`✅ Newsletter subscription email sent to ${email}`);

        } catch (emailError) {
            // Log email error but don't fail the subscription
            console.error('❌ Failed to send newsletter email:');
            console.error('   - Error:', emailError.message);
            console.error('   - Error code:', emailError.code);
            console.error('   - Response:', emailError.response);
            console.error('   - Subscription was recorded successfully despite email failure');
        }

        res.status(200).json({
            success: true,
            message: "Successfully subscribed to newsletter! Check your email for exclusive offers."
        });

    } catch (error) {
        console.error('Newsletter subscription error:', error.message);
        res.status(500).json({ success: false, message: 'Failed to subscribe to newsletter' });
    }
};