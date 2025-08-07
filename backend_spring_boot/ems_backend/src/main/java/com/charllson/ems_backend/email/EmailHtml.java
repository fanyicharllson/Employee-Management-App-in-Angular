package com.charllson.ems_backend.email;

import org.springframework.stereotype.Component;

@Component
public class EmailHtml {

    public String buildVerificationEmail(String name, String link) {
        return String.format("""
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Verify Your Email - TeamNest</title>
                    <style>
                        body {
                            font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
                            background: linear-gradient(135deg, #f8fafc 0%%, #e2e8f0 100%%);
                            padding: 0;
                            margin: 0;
                            line-height: 1.6;
                        }
                        .email-container {
                            max-width: 600px;
                            margin: 40px auto;
                            background: #ffffff;
                            border-radius: 16px;
                            box-shadow: 0 20px 50px rgba(139, 92, 246, 0.1);
                            overflow: hidden;
                        }
                        .header {
                            background: linear-gradient(135deg, #8b5cf6 0%%, #7c3aed 100%%);
                            padding: 40px 30px;
                            text-align: center;
                            color: white;
                        }
                        .logo {
                            font-size: 28px;
                            font-weight: 800;
                            margin-bottom: 8px;
                            letter-spacing: -0.5px;
                        }
                        .tagline {
                            font-size: 14px;
                            opacity: 0.9;
                            margin: 0;
                        }
                        .content {
                            padding: 40px 30px;
                        }
                        .greeting {
                            font-size: 24px;
                            font-weight: 600;
                            color: #1e293b;
                            margin-bottom: 16px;
                        }
                        .message {
                            color: #475569;
                            font-size: 16px;
                            margin-bottom: 24px;
                        }
                        .verification-button {
                            display: inline-block;
                            background: linear-gradient(135deg, #8b5cf6 0%%, #7c3aed 100%%);
                            color: #ffffff;
                            text-decoration: none;
                            padding: 16px 32px;
                            border-radius: 12px;
                            font-weight: 600;
                            font-size: 16px;
                            margin: 20px 0;
                            transition: transform 0.2s ease;
                            box-shadow: 0 8px 25px rgba(139, 92, 246, 0.3);
                        }
                        .verification-button:hover {
                            transform: translateY(-2px);
                        }
                        .security-notice {
                            background: #f1f5f9;
                            border-left: 4px solid #8b5cf6;
                            padding: 16px 20px;
                            margin: 24px 0;
                            border-radius: 8px;
                        }
                        .security-notice h4 {
                            color: #7c3aed;
                            margin: 0 0 8px 0;
                            font-size: 14px;
                            font-weight: 600;
                        }
                        .security-notice p {
                            color: #64748b;
                            margin: 0;
                            font-size: 14px;
                        }
                        .footer {
                            background: #f8fafc;
                            padding: 30px;
                            text-align: center;
                            border-top: 1px solid #e2e8f0;
                        }
                        .footer-text {
                            color: #64748b;
                            font-size: 14px;
                            margin: 0;
                        }
                        .social-links {
                            margin-top: 20px;
                        }
                        .social-links a {
                            display: inline-block;
                            margin: 0 8px;
                            color: #8b5cf6;
                            text-decoration: none;
                        }
                    </style>
                </head>
                <body>
                    <div class="email-container">
                        <div class="header">
                            <div class="logo">TeamNest</div>
                            <p class="tagline">Employee Management Made Simple</p>
                        </div>
                
                        <div class="content">
                            <div class="greeting">Welcome to TeamNest, %s! 👋</div>
                
                            <p class="message">
                                We're excited to have you join our platform. To get started and secure your account,
                                please verify your email address by clicking the button below.
                            </p>
                
                            <div style="text-align: center;">
                                <a href="%s" class="verification-button">Verify My Email</a>
                            </div>
                
                            <div class="security-notice">
                                <h4>🔒 Security Notice</h4>
                                <p>This verification link will expire in <strong>15 minutes</strong> for your security.
                                If you didn't create a TeamNest account, you can safely ignore this email.</p>
                            </div>
                
                            <p class="message" style="margin-top: 24px;">
                                If the button doesn't work, you can copy and paste this link into your browser:<br>
                                <span style="color: #8b5cf6; word-break: break-all;">%s</span>
                            </p>
                        </div>
                
                        <div class="footer">
                            <p class="footer-text">
                                © %d TeamNest by CharlseEmpire Tech. All rights reserved.
                            </p>
                            <div class="social-links">
                                <a href="#">Privacy Policy</a> |
                                <a href="#">Terms of Service</a> |
                                <a href="#">Support</a>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
                """, name, link, link, java.time.Year.now().getValue());
    }

    public String buildWelcomeEmail(String name, String link) {
        return String.format(
                """
                        <!DOCTYPE html>
                        <html lang="en">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>Welcome to TeamNest!</title>
                            <style>
                                body {
                                    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
                                    background: linear-gradient(135deg, #f8fafc 0%%, #e2e8f0 100%%);
                                    padding: 0;
                                    margin: 0;
                                    line-height: 1.6;
                                }
                                .email-container {
                                    max-width: 600px;
                                    margin: 40px auto;
                                    background: #ffffff;
                                    border-radius: 16px;
                                    box-shadow: 0 20px 50px rgba(139, 92, 246, 0.1);
                                    overflow: hidden;
                                }
                                .header {
                                    background: linear-gradient(135deg, #8b5cf6 0%%, #7c3aed 100%%);
                                    padding: 40px 30px;
                                    text-align: center;
                                    color: white;
                                }
                                .logo {
                                    font-size: 28px;
                                    font-weight: 800;
                                    margin-bottom: 8px;
                                    letter-spacing: -0.5px;
                                }
                                .tagline {
                                    font-size: 14px;
                                    opacity: 0.9;
                                    margin: 0;
                                }
                                .content {
                                    padding: 40px 30px;
                                }
                                .greeting {
                                    font-size: 24px;
                                    font-weight: 600;
                                    color: #1e293b;
                                    margin-bottom: 16px;
                                }
                                .message {
                                    color: #475569;
                                    font-size: 16px;
                                    margin-bottom: 24px;
                                }
                                .feature-grid {
                                    display: grid;
                                    grid-template-columns: 1fr 1fr;
                                    gap: 20px;
                                    margin: 30px 0;
                                }
                                .feature-card {
                                    background: #f8fafc;
                                    padding: 20px;
                                    border-radius: 12px;
                                    border: 2px solid #e2e8f0;
                                    text-align: center;
                                }
                                .feature-icon {
                                    font-size: 32px;
                                    margin-bottom: 12px;
                                }
                                .feature-title {
                                    font-weight: 600;
                                    color: #7c3aed;
                                    margin-bottom: 8px;
                                    font-size: 14px;
                                }
                                .feature-desc {
                                    color: #64748b;
                                    font-size: 13px;
                                    margin: 0;
                                }
                                .cta-button {
                                    display: inline-block;
                                    background: linear-gradient(135deg, #8b5cf6 0%%, #7c3aed 100%%);
                                    color: #ffffff;
                                    text-decoration: none;
                                    padding: 16px 32px;
                                    border-radius: 12px;
                                    font-weight: 600;
                                    font-size: 16px;
                                    margin: 20px 0;
                                    transition: transform 0.2s ease;
                                    box-shadow: 0 8px 25px rgba(139, 92, 246, 0.3);
                                }
                                .cta-button:hover {
                                    transform: translateY(-2px);
                                }
                                .footer {
                                    background: #f8fafc;
                                    padding: 30px;
                                    text-align: center;
                                    border-top: 1px solid #e2e8f0;
                                }
                                .footer-text {
                                    color: #64748b;
                                    font-size: 14px;
                                    margin: 0;
                                }
                                .social-links {
                                    margin-top: 20px;
                                }
                                .social-links a {
                                    display: inline-block;
                                    margin: 0 8px;
                                    color: #8b5cf6;
                                    text-decoration: none;
                                }
                                @media (max-width: 600px) {
                                    .feature-grid {
                                        grid-template-columns: 1fr;
                                    }
                                }
                            </style>
                        </head>
                        <body>
                            <div class="email-container">
                                <div class="header">
                                    <div class="logo">TeamNest</div>
                                    <p class="tagline">Employee Management Made Simple</p>
                                </div>
                        
                                <div class="content">
                                    <div class="greeting">Welcome aboard, %s! 🎉</div>
                        
                                    <p class="message">
                                        Congratulations! Your email has been verified and your TeamNest account is now active.
                                        We're thrilled to have you as part of our community.
                                    </p>
                        
                                    <div class="feature-grid">
                                        <div class="feature-card">
                                            <div class="feature-icon">👥</div>
                                            <div class="feature-title">Team Management</div>
                                            <p class="feature-desc">Organize and manage your team members efficiently</p>
                                        </div>
                                        <div class="feature-card">
                                            <div class="feature-icon">📊</div>
                                            <div class="feature-title">Performance Tracking</div>
                                            <p class="feature-desc">Monitor and evaluate employee performance</p>
                                        </div>
                                        <div class="feature-card">
                                            <div class="feature-icon">📅</div>
                                            <div class="feature-title">Schedule Management</div>
                                            <p class="feature-desc">Plan and coordinate work schedules seamlessly</p>
                                        </div>
                                        <div class="feature-card">
                                            <div class="feature-icon">📈</div>
                                            <div class="feature-title">Analytics & Reports</div>
                                            <p class="feature-desc">Get insights with detailed analytics</p>
                                        </div>
                                    </div>
                        
                                    <p class="message">
                                        Ready to start managing your team more effectively? Let's get you set up!
                                    </p>
                        
                                    <div style="text-align: center;">
                                        <a href="%s" class="cta-button">Get Started Now</a>
                                    </div>
                        
                                    <p class="message" style="margin-top: 24px; font-size: 14px; color: #64748b;">
                                        Need help getting started? Check out our <a href="#" style="color: #8b5cf6;">getting started guide</a>
                                        or <a href="#" style="color: #8b5cf6;">contact our support team</a>.
                                    </p>
                                </div>
                        
                                <div class="footer">
                                    <p class="footer-text">
                                        © %d TeamNest by CharlseEmpire Tech. All rights reserved.
                                    </p>
                                    <div class="social-links">
                                        <a href="#">Privacy Policy</a> |
                                        <a href="#">Terms of Service</a> |
                                        <a href="#">Support</a>
                                    </div>
                                </div>
                            </div>
                        </body>
                        </html>
                        """,
                name, link, java.time.Year.now().getValue());
    }

    public String buildPasswordResetEmail(String name, String resetLink) {
        return String.format(
                """
                        <!DOCTYPE html>
                        <html lang="en">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>Reset Your Password - TeamNest</title>
                            <style>
                                body {
                                    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
                                    background: linear-gradient(135deg, #f8fafc 0%%, #e2e8f0 100%%);
                                    padding: 0;
                                    margin: 0;
                                    line-height: 1.6;
                                }
                                .email-container {
                                    max-width: 600px;
                                    margin: 40px auto;
                                    background: #ffffff;
                                    border-radius: 16px;
                                    box-shadow: 0 20px 50px rgba(139, 92, 246, 0.1);
                                    overflow: hidden;
                                }
                                .header {
                                    background: linear-gradient(135deg, #8b5cf6 0%%, #7c3aed 100%%);
                                    padding: 40px 30px;
                                    text-align: center;
                                    color: white;
                                }
                                .logo {
                                    font-size: 28px;
                                    font-weight: 800;
                                    margin-bottom: 8px;
                                    letter-spacing: -0.5px;
                                }
                                .tagline {
                                    font-size: 14px;
                                    opacity: 0.9;
                                    margin: 0;
                                }
                                .content {
                                    padding: 40px 30px;
                                }
                                .greeting {
                                    font-size: 24px;
                                    font-weight: 600;
                                    color: #1e293b;
                                    margin-bottom: 16px;
                                }
                                .message {
                                    color: #475569;
                                    font-size: 16px;
                                    margin-bottom: 24px;
                                }
                                .reset-button {
                                    display: inline-block;
                                    background: linear-gradient(135deg, #8b5cf6 0%%, #7c3aed 100%%);
                                    color: #ffffff;
                                    text-decoration: none;
                                    padding: 16px 32px;
                                    border-radius: 12px;
                                    font-weight: 600;
                                    font-size: 16px;
                                    margin: 20px 0;
                                    transition: transform 0.2s ease;
                                    box-shadow: 0 8px 25px rgba(139, 92, 246, 0.3);
                                }
                                .reset-button:hover {
                                    transform: translateY(-2px);
                                }
                                .security-notice {
                                    background: #fef3c7;
                                    border-left: 4px solid #f59e0b;
                                    padding: 16px 20px;
                                    margin: 24px 0;
                                    border-radius: 8px;
                                }
                                .security-notice h4 {
                                    color: #d97706;
                                    margin: 0 0 8px 0;
                                    font-size: 14px;
                                    font-weight: 600;
                                }
                                .security-notice p {
                                    color: #92400e;
                                    margin: 0;
                                    font-size: 14px;
                                }
                                .footer {
                                    background: #f8fafc;
                                    padding: 30px;
                                    text-align: center;
                                    border-top: 1px solid #e2e8f0;
                                }
                                .footer-text {
                                    color: #64748b;
                                    font-size: 14px;
                                    margin: 0;
                                }
                                .social-links {
                                    margin-top: 20px;
                                }
                                .social-links a {
                                    display: inline-block;
                                    margin: 0 8px;
                                    color: #8b5cf6;
                                    text-decoration: none;
                                }
                            </style>
                        </head>
                        <body>
                            <div class="email-container">
                                <div class="header">
                                    <div class="logo">TeamNest</div>
                                    <p class="tagline">Employee Management Made Simple</p>
                                </div>
                        
                                <div class="content">
                                    <div class="greeting">Password Reset Request 🔒</div>
                        
                                    <p class="message">
                                        Hi %s,
                                    </p>
                        
                                    <p class="message">
                                        We received a request to reset your TeamNest account password. If you made this request,
                                        click the button below to create a new password.
                                    </p>
                        
                                    <div style="text-align: center;">
                                        <a href="%s" class="reset-button">Reset My Password</a>
                                    </div>
                        
                                    <div class="security-notice">
                                        <h4>⚠️ Security Alert</h4>
                                        <p>This password reset link will expire in <strong>30 minutes</strong>.
                                        If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
                                    </div>
                        
                                    <p class="message" style="margin-top: 24px;">
                                        If the button doesn't work, you can copy and paste this link into your browser:<br>
                                        <span style="color: #8b5cf6; word-break: break-all;">%s</span>
                                    </p>
                        
                                    <p class="message" style="font-size: 14px; color: #64748b;">
                                        For security reasons, this link can only be used once. If you need another reset link,
                                        please visit our login page and request a new one.
                                    </p>
                                </div>
                        
                                <div class="footer">
                                    <p class="footer-text">
                                        © %d TeamNest by CharlseEmpire Tech. All rights reserved.
                                    </p>
                                    <div class="social-links">
                                        <a href="#">Privacy Policy</a> |
                                        <a href="#">Terms of Service</a> |
                                        <a href="#">Support</a>
                                    </div>
                                </div>
                            </div>
                        </body>
                        </html>
                        """,
                name, resetLink, resetLink, java.time.Year.now().getValue());
    }

    public String buildAccountActivationEmail(String name, String activationLink) {
        return String.format(
                """
                        <!DOCTYPE html>
                        <html lang="en">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>Activate Your Account - TeamNest</title>
                            <style>
                                body {
                                    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
                                    background: linear-gradient(135deg, #f8fafc 0%%, #e2e8f0 100%%);
                                    padding: 0;
                                    margin: 0;
                                    line-height: 1.6;
                                }
                                .email-container {
                                    max-width: 600px;
                                    margin: 40px auto;
                                    background: #ffffff;
                                    border-radius: 16px;
                                    box-shadow: 0 20px 50px rgba(139, 92, 246, 0.1);
                                    overflow: hidden;
                                }
                                .header {
                                    background: linear-gradient(135deg, #8b5cf6 0%%, #7c3aed 100%%);
                                    padding: 40px 30px;
                                    text-align: center;
                                    color: white;
                                }
                                .logo {
                                    font-size: 28px;
                                    font-weight: 800;
                                    margin-bottom: 8px;
                                    letter-spacing: -0.5px;
                                }
                                .tagline {
                                    font-size: 14px;
                                    opacity: 0.9;
                                    margin: 0;
                                }
                                .content {
                                    padding: 40px 30px;
                                }
                                .greeting {
                                    font-size: 24px;
                                    font-weight: 600;
                                    color: #1e293b;
                                    margin-bottom: 16px;
                                }
                                .message {
                                    color: #475569;
                                    font-size: 16px;
                                    margin-bottom: 24px;
                                }
                                .activation-button {
                                    display: inline-block;
                                    background: linear-gradient(135deg, #10b981 0%%, #059669 100%%);
                                    color: #ffffff;
                                    text-decoration: none;
                                    padding: 16px 32px;
                                    border-radius: 12px;
                                    font-weight: 600;
                                    font-size: 16px;
                                    margin: 20px 0;
                                    transition: transform 0.2s ease;
                                    box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
                                }
                                .activation-button:hover {
                                    transform: translateY(-2px);
                                }
                                .info-notice {
                                    background: #ecfdf5;
                                    border-left: 4px solid #10b981;
                                    padding: 16px 20px;
                                    margin: 24px 0;
                                    border-radius: 8px;
                                }
                                .info-notice h4 {
                                    color: #059669;
                                    margin: 0 0 8px 0;
                                    font-size: 14px;
                                    font-weight: 600;
                                }
                                .info-notice p {
                                    color: #065f46;
                                    margin: 0;
                                    font-size: 14px;
                                }
                                .footer {
                                    background: #f8fafc;
                                    padding: 30px;
                                    text-align: center;
                                    border-top: 1px solid #e2e8f0;
                                }
                                .footer-text {
                                    color: #64748b;
                                    font-size: 14px;
                                    margin: 0;
                                }
                                .social-links {
                                    margin-top: 20px;
                                }
                                .social-links a {
                                    display: inline-block;
                                    margin: 0 8px;
                                    color: #8b5cf6;
                                    text-decoration: none;
                                }
                            </style>
                        </head>
                        <body>
                            <div class="email-container">
                                <div class="header">
                                    <div class="logo">TeamNest</div>
                                    <p class="tagline">Employee Management Made Simple</p>
                                </div>
                        
                                <div class="content">
                                    <div class="greeting">Account Activation Required ✨</div>
                        
                                    <p class="message">
                                        Hello %s,
                                    </p>
                        
                                    <p class="message">
                                        Your TeamNest account has been created by your administrator and is ready for activation.
                                        To complete the setup and start using your account, please click the button below.
                                    </p>
                        
                                    <div style="text-align: center;">
                                        <a href="%s" class="activation-button">Activate My Account</a>
                                    </div>
                        
                                    <div class="info-notice">
                                        <h4>🚀 What's Next?</h4>
                                        <p>After activation, you'll be able to set your password and access all TeamNest features.
                                        This activation link will expire in <strong>24 hours</strong> for security purposes.</p>
                                    </div>
                        
                                    <p class="message" style="margin-top: 24px;">
                                        If the button doesn't work, you can copy and paste this link into your browser:<br>
                                        <span style="color: #8b5cf6; word-break: break-all;">%s</span>
                                    </p>
                        
                                    <p class="message" style="font-size: 14px; color: #64748b;">
                                        If you didn't expect this email or have questions about your account,
                                        please contact your administrator or our support team.
                                    </p>
                                </div>
                        
                                <div class="footer">
                                    <p class="footer-text">
                                        © %d TeamNest by CharlseEmpire Tech. All rights reserved.
                                    </p>
                                    <div class="social-links">
                                        <a href="#">Privacy Policy</a> |
                                        <a href="#">Terms of Service</a> |
                                        <a href="#">Support</a>
                                    </div>
                                </div>
                            </div>
                        </body>
                        </html>
                        """,
                name, activationLink, activationLink, java.time.Year.now().getValue());
    }

    public String buildAddEmployeeEmail(String employeeFullName, String email, String companyName, String department, String occupation, String hrFullName, String link) {
        return String.format(
                """
                        <!DOCTYPE html>
                        <html lang="en">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>Welcome to %s - TeamNest Account Created</title>
                            <style>
                                body {
                                    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
                                    background: linear-gradient(135deg, #f8fafc 0%%, #e2e8f0 100%%);
                                    padding: 0;
                                    margin: 0;
                                    line-height: 1.6;
                                }
                                .email-container {
                                    max-width: 600px;
                                    margin: 40px auto;
                                    background: #ffffff;
                                    border-radius: 16px;
                                    box-shadow: 0 20px 50px rgba(34, 197, 94, 0.1);
                                    overflow: hidden;
                                }
                                .header {
                                    background: linear-gradient(135deg, #22c55e 0%%, #16a34a 100%%);
                                    padding: 40px 30px;
                                    text-align: center;
                                    color: white;
                                }
                                .logo {
                                    font-size: 28px;
                                    font-weight: 800;
                                    margin-bottom: 8px;
                                    letter-spacing: -0.5px;
                                }
                                .tagline {
                                    font-size: 14px;
                                    opacity: 0.9;
                                    margin: 0;
                                }
                                .content {
                                    padding: 40px 30px;
                                }
                                .greeting {
                                    font-size: 24px;
                                    font-weight: 600;
                                    color: #1e293b;
                                    margin-bottom: 16px;
                                }
                                .message {
                                    color: #475569;
                                    font-size: 16px;
                                    margin-bottom: 24px;
                                }
                                .employee-info {
                                    background: #f0fdf4;
                                    border: 2px solid #bbf7d0;
                                    border-radius: 12px;
                                    padding: 24px;
                                    margin: 24px 0;
                                }
                                .info-title {
                                    font-size: 18px;
                                    font-weight: 600;
                                    color: #16a34a;
                                    margin-bottom: 16px;
                                    display: flex;
                                    align-items: center;
                                    gap: 8px;
                                }
                                .info-grid {
                                    display: grid;
                                    grid-template-columns: 1fr 1fr;
                                    gap: 16px;
                                }
                                .info-item {
                                    display: flex;
                                    flex-direction: column;
                                }
                                .info-label {
                                    font-size: 12px;
                                    font-weight: 600;
                                    color: #059669;
                                    text-transform: uppercase;
                                    letter-spacing: 0.5px;
                                    margin-bottom: 4px;
                                }
                                .info-value {
                                    font-size: 14px;
                                    color: #374151;
                                    font-weight: 500;
                                }
                                .feature-grid {
                                    display: grid;
                                    grid-template-columns: 1fr 1fr;
                                    gap: 20px;
                                    margin: 30px 0;
                                }
                                .feature-card {
                                    background: #f8fafc;
                                    padding: 20px;
                                    border-radius: 12px;
                                    border: 2px solid #e2e8f0;
                                    text-align: center;
                                }
                                .feature-icon {
                                    font-size: 32px;
                                    margin-bottom: 12px;
                                }
                                .feature-title {
                                    font-weight: 600;
                                    color: #16a34a;
                                    margin-bottom: 8px;
                                    font-size: 14px;
                                }
                                .feature-desc {
                                    color: #64748b;
                                    font-size: 13px;
                                    margin: 0;
                                }
                                .cta-button {
                                    display: inline-block;
                                    background: linear-gradient(135deg, #22c55e 0%%, #16a34a 100%%);
                                    color: #ffffff;
                                    text-decoration: none;
                                    padding: 16px 32px;
                                    border-radius: 12px;
                                    font-weight: 600;
                                    font-size: 16px;
                                    margin: 20px 0;
                                    transition: transform 0.2s ease;
                                    box-shadow: 0 8px 25px rgba(34, 197, 94, 0.3);
                                }
                                .cta-button:hover {
                                    transform: translateY(-2px);
                                }
                                .hr-mention {
                                    background: #fef3c7;
                                    border-left: 4px solid #f59e0b;
                                    padding: 16px 20px;
                                    margin: 24px 0;
                                    border-radius: 0 8px 8px 0;
                                }
                                .hr-mention-text {
                                    color: #92400e;
                                    font-size: 14px;
                                    margin: 0;
                                    font-style: italic;
                                }
                                .footer {
                                    background: #f8fafc;
                                    padding: 30px;
                                    text-align: center;
                                    border-top: 1px solid #e2e8f0;
                                }
                                .footer-text {
                                    color: #64748b;
                                    font-size: 14px;
                                    margin: 0;
                                }
                                .social-links {
                                    margin-top: 20px;
                                }
                                .social-links a {
                                    display: inline-block;
                                    margin: 0 8px;
                                    color: #16a34a;
                                    text-decoration: none;
                                }
                                @media (max-width: 600px) {
                                    .feature-grid {
                                        grid-template-columns: 1fr;
                                    }
                                    .info-grid {
                                        grid-template-columns: 1fr;
                                    }
                                }
                            </style>
                        </head>
                        <body>
                            <div class="email-container">
                                <div class="header">
                                    <div class="logo">TeamNest</div>
                                    <p class="tagline">Employee Management Made Simple</p>
                                </div>
                        
                                <div class="content">
                                    <div class="greeting">Welcome to %s, %s! 🎉</div>
                        
                                    <p class="message">
                                        Great news! Your TeamNest account has been created and you've been added to your organization's employee management system. 
                                        We're excited to have you on board!
                                    </p>
                        
                                    <div class="employee-info">
                                        <div class="info-title">
                                            👤 Your Employee Profile
                                        </div>
                                        <div class="info-grid">
                                            <div class="info-item">
                                                <div class="info-label">Full Name</div>
                                                <div class="info-value">%s</div>
                                            </div>
                                            <div class="info-item">
                                                <div class="info-label">Email Address</div>
                                                <div class="info-value">%s</div>
                                            </div>
                                            <div class="info-item">
                                                <div class="info-label">Company</div>
                                                <div class="info-value">%s</div>
                                            </div>
                                            <div class="info-item">
                                                <div class="info-label">Department</div>
                                                <div class="info-value">%s</div>
                                            </div>
                                            <div class="info-item">
                                                <div class="info-label">Position</div>
                                                <div class="info-value">%s</div>
                                            </div>
                                            <div class="info-item">
                                                <div class="info-label">Role</div>
                                                <div class="info-value">Employee</div>
                                            </div>
                                        </div>
                                    </div>
                        
                                    <div class="hr-mention">
                                        <p class="hr-mention-text">
                                            🤝 You were added to the system by %s from HR. They will be your primary contact for any administrative questions.
                                        </p>
                                    </div>
                                     <div class="hr-mention">
                                        <p class="hr-mention-text">
                                            🔒🔒 NB: Your Invitation expires in 7days!.
                                        </p>
                                    </div>
                        
                                    <div class="feature-grid">
                                        <div class="feature-card">
                                            <div class="feature-icon">🏢</div>
                                            <div class="feature-title">Company Dashboard</div>
                                            <p class="feature-desc">Access your personalized employee dashboard</p>
                                        </div>
                                        <div class="feature-card">
                                            <div class="feature-icon">📋</div>
                                            <div class="feature-title">Task Management</div>
                                            <p class="feature-desc">View and manage your assigned tasks</p>
                                        </div>
                                        <div class="feature-card">
                                            <div class="feature-icon">🕒</div>
                                            <div class="feature-title">Time Tracking</div>
                                            <p class="feature-desc">Log your work hours and track attendance</p>
                                        </div>
                                        <div class="feature-card">
                                            <div class="feature-icon">👥</div>
                                            <div class="feature-title">Team Collaboration</div>
                                            <p class="feature-desc">Connect and collaborate with your colleagues</p>
                                        </div>
                                    </div>
                        
                                    <p class="message">
                                        Ready to join your organization and start collaborating with your team? Click the button below to complete your account setup!
                                    </p>
                        
                                    <div style="text-align: center;">
                                        <a href="%s" class="cta-button">Join Organization Now</a>
                                    </div>
                        
                                    <p class="message" style="margin-top: 24px; font-size: 14px; color: #64748b;">
                                        Need assistance? Feel free to reach out to %s or 
                                        <a href="#" style="color: #16a34a;">contact our support team</a> for help getting started.
                                    </p>
                                </div>
                        
                                <div class="footer">
                                    <p class="footer-text">
                                        © %d TeamNest by CharlseEmpire Tech. All rights reserved.
                                    </p>
                                    <div class="social-links">
                                        <a href="#">Privacy Policy</a> |
                                        <a href="#">Terms of Service</a> |
                                        <a href="#">Support</a>
                                    </div>
                                </div>
                            </div>
                        </body>
                        </html>
                        """,
                companyName,
                companyName, employeeFullName, // header greeting
                employeeFullName, email, companyName, department, occupation, // employee info grid
                hrFullName, // hr mention
                link, // cta button
                hrFullName, // support contact
                java.time.Year.now().getValue()); // footer year
    }

    public String buildEmployeeWelcomeEmail(String companyName, String employeeName, String link) {
        return String.format(
                """
                        <!DOCTYPE html>
                        <html lang="en">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>Welcome to %s!</title>
                            <style>
                                body {
                                    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
                                    background: linear-gradient(135deg, #f8fafc 0%%, #e2e8f0 100%%);
                                    padding: 0;
                                    margin: 0;
                                    line-height: 1.6;
                                }
                                .email-container {
                                    max-width: 600px;
                                    margin: 40px auto;
                                    background: #ffffff;
                                    border-radius: 16px;
                                    box-shadow: 0 20px 50px rgba(139, 92, 246, 0.1);
                                    overflow: hidden;
                                }
                                .header {
                                    background: linear-gradient(135deg, #8b5cf6 0%%, #7c3aed 100%%);
                                    padding: 40px 30px;
                                    text-align: center;
                                    color: white;
                                }
                                .logo {
                                    font-size: 28px;
                                    font-weight: 800;
                                    margin-bottom: 8px;
                                    letter-spacing: -0.5px;
                                }
                                .tagline {
                                    font-size: 14px;
                                    opacity: 0.9;
                                    margin: 0;
                                }
                                .content {
                                    padding: 40px 30px;
                                }
                                .greeting {
                                    font-size: 24px;
                                    font-weight: 600;
                                    color: #1e293b;
                                    margin-bottom: 16px;
                                }
                                .message {
                                    color: #475569;
                                    font-size: 16px;
                                    margin-bottom: 24px;
                                }
                                .highlight-box {
                                    background: linear-gradient(135deg, #f1f5f9 0%%, #e2e8f0 100%%);
                                    border-left: 4px solid #8b5cf6;
                                    padding: 24px;
                                    border-radius: 12px;
                                    margin: 30px 0;
                                }
                                .highlight-text {
                                    font-size: 18px;
                                    font-weight: 600;
                                    color: #7c3aed;
                                    margin: 0;
                                    text-align: center;
                                }
                                .feature-grid {
                                    display: grid;
                                    grid-template-columns: 1fr 1fr;
                                    gap: 20px;
                                    margin: 30px 0;
                                }
                                .feature-card {
                                    background: #f8fafc;
                                    padding: 20px;
                                    border-radius: 12px;
                                    border: 2px solid #e2e8f0;
                                    text-align: center;
                                    transition: transform 0.2s ease;
                                }
                                .feature-card:hover {
                                    transform: translateY(-2px);
                                    border-color: #c4b5fd;
                                }
                                .feature-icon {
                                    font-size: 32px;
                                    margin-bottom: 12px;
                                }
                                .feature-title {
                                    font-weight: 600;
                                    color: #7c3aed;
                                    margin-bottom: 8px;
                                    font-size: 14px;
                                }
                                .feature-desc {
                                    color: #64748b;
                                    font-size: 13px;
                                    margin: 0;
                                }
                                .cta-button {
                                    display: inline-block;
                                    background: linear-gradient(135deg, #8b5cf6 0%%, #7c3aed 100%%);
                                    color: #ffffff;
                                    text-decoration: none;
                                    padding: 16px 32px;
                                    border-radius: 12px;
                                    font-weight: 600;
                                    font-size: 16px;
                                    margin: 20px 0;
                                    transition: all 0.3s ease;
                                    box-shadow: 0 8px 25px rgba(139, 92, 246, 0.3);
                                }
                                .cta-button:hover {
                                    transform: translateY(-2px);
                                    box-shadow: 0 12px 35px rgba(139, 92, 246, 0.4);
                                }
                                .next-steps {
                                    background: #fefce8;
                                    border: 2px solid #fde047;
                                    border-radius: 12px;
                                    padding: 24px;
                                    margin: 30px 0;
                                }
                                .next-steps-title {
                                    font-size: 18px;
                                    font-weight: 600;
                                    color: #a16207;
                                    margin-bottom: 12px;
                                    display: flex;
                                    align-items: center;
                                    gap: 8px;
                                }
                                .steps-list {
                                    color: #713f12;
                                    font-size: 14px;
                                    margin: 0;
                                    padding-left: 20px;
                                }
                                .steps-list li {
                                    margin-bottom: 6px;
                                }
                                .footer {
                                    background: #f8fafc;
                                    padding: 30px;
                                    text-align: center;
                                    border-top: 1px solid #e2e8f0;
                                }
                                .footer-text {
                                    color: #64748b;
                                    font-size: 14px;
                                    margin: 0;
                                }
                                .social-links {
                                    margin-top: 20px;
                                }
                                .social-links a {
                                    display: inline-block;
                                    margin: 0 8px;
                                    color: #8b5cf6;
                                    text-decoration: none;
                                    transition: color 0.2s ease;
                                }
                                .social-links a:hover {
                                    color: #7c3aed;
                                }
                                @media (max-width: 600px) {
                                    .feature-grid {
                                        grid-template-columns: 1fr;
                                    }
                                    .email-container {
                                        margin: 20px;
                                    }
                                    .content {
                                        padding: 30px 20px;
                                    }
                                    .header {
                                        padding: 30px 20px;
                                    }
                                }
                            </style>
                        </head>
                        <body>
                            <div class="email-container">
                                <div class="header">
                                    <div class="logo">TeamNest</div>
                                    <p class="tagline">by CharlseEmpire Tech</p>
                                </div>
                        
                                <div class="content">
                                    <div class="greeting">Welcome to %s, %s! 🎉</div>
                        
                                    <p class="message">
                                        We're absolutely thrilled to welcome you to our team! Your journey with us begins today, 
                                        and we're excited to see the amazing contributions you'll make.
                                    </p>
                        
                                    <div class="highlight-box">
                                        <p class="highlight-text">🌟 You're now part of something special! 🌟</p>
                                    </div>
                        
                                    <div class="feature-grid">
                                        <div class="feature-card">
                                            <div class="feature-icon">🤝</div>
                                            <div class="feature-title">Team Collaboration</div>
                                            <p class="feature-desc">Connect and collaborate with your colleagues</p>
                                        </div>
                                        <div class="feature-card">
                                            <div class="feature-icon">📋</div>
                                            <div class="feature-title">Task Management</div>
                                            <p class="feature-desc">Organize your work and track progress</p>
                                        </div>
                                        <div class="feature-card">
                                            <div class="feature-icon">💬</div>
                                            <div class="feature-title">Communication</div>
                                            <p class="feature-desc">Stay connected with team messaging</p>
                                        </div>
                                        <div class="feature-card">
                                            <div class="feature-icon">📚</div>
                                            <div class="feature-title">Learning Resources</div>
                                            <p class="feature-desc">Access training materials and guides</p>
                                        </div>
                                    </div>
                        
                                    <div class="next-steps">
                                        <div class="next-steps-title">
                                            ⚡ Next Steps to Get Started:
                                        </div>
                                        <ol class="steps-list">
                                            <li>Complete your profile setup</li>
                                            <li>Explore your team dashboard</li>
                                            <li>Join your first team meeting</li>
                                            <li>Connect with your colleagues</li>
                                        </ol>
                                    </div>
                        
                                    <p class="message">
                                        Ready to dive in? Click the button below to access your personalized workspace 
                                        and start your exciting journey with us!
                                    </p>
                        
                                    <div style="text-align: center;">
                                        <a href="%s" class="cta-button">Access My Workspace</a>
                                    </div>
                        
                                    <p class="message" style="margin-top: 24px; font-size: 14px; color: #64748b;">
                                        Questions? Don't hesitate to reach out! Contact your manager or our 
                                        <a href="#" style="color: #8b5cf6;">HR support team</a> - we're here to help you succeed.
                                    </p>
                                </div>
                        
                                <div class="footer">
                                    <p class="footer-text">
                                        © %d TeamNest by CharlseEmpire Tech. All rights reserved.
                                    </p>
                                    <div class="social-links">
                                        <a href="#">Employee Handbook</a> |
                                        <a href="#">Support Center</a> |
                                        <a href="#">Company Portal</a>
                                    </div>
                                </div>
                            </div>
                        </body>
                        </html>
                        """,
                companyName, companyName, employeeName, link, java.time.Year.now().getValue());
    }
}