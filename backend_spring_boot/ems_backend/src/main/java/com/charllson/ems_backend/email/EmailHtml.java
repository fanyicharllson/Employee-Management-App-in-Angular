package com.charllson.ems_backend.email;

import org.springframework.stereotype.Component;

@Component
public class EmailHtml {
    public String buildEmailHtml(String name, String link) {
    return String.format("""
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Verify your email</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background-color: #f9f9f9;
                    padding: 0; margin: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 2rem auto;
                    background: #ffffff;
                    padding: 2rem;
                    border-radius: 8px;
                    box-shadow: 0 8px 20px rgba(0,0,0,0.1);
                }
                .button {
                    display: inline-block;
                    margin-top: 20px;
                    padding: 12px 24px;
                    background-color: #7e22ce;
                    color: #ffffff;
                    text-decoration: none;
                    border-radius: 6px;
                    font-weight: bold;
                }
                .footer {
                    margin-top: 30px;
                    text-align: center;
                    font-size: 13px;
                    color: #777;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>Email Verification</h2>
                <p>Hello <strong>%s</strong>,</p>
                <p>Please click the button below to verify your email address. This link will expire in <strong>15 minutes</strong>.</p>
                <a href="%s" class="button">Verify Email</a>
                <p style="margin-top: 20px;">If you did not request this, you can safely ignore it.</p>
                <div class="footer">
                    &copy; %s CharlseEmpire Tech. All rights reserved.
                </div>
            </div>
        </body>
        </html>
        """, name, link, java.time.Year.now());
}

}
