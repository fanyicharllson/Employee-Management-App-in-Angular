package com.charllson.ems_backend.services;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.resend.*;
import com.resend.core.exception.ResendException;
import com.resend.services.emails.model.CreateEmailOptions;
import com.resend.services.emails.model.CreateEmailResponse;

@Service
public class EmailService {

    @Value("${resend.api-key}")
    private String apiKey;

    @Value("${resend.from-email}")
    private String fromEmail;

    public void sendEmail(String to, String subject, String htmlContent) {
        Resend resend = new Resend(apiKey);

        CreateEmailOptions params = CreateEmailOptions.builder()
                .from("TeamNest | CharlseEmpire Tech <" + fromEmail + ">")
                .to(to)
                .subject(subject)
                .html(htmlContent)
                .build();

        try {
            CreateEmailResponse data = resend.emails().send(params);
            System.out.println("Email Sent successfully of SUBJECT: " + subject + data.getId());
        } catch (ResendException e) {
            e.printStackTrace();
        }
    }
}