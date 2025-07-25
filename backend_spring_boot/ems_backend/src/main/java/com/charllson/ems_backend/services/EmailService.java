package com.charllson.ems_backend.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.charllson.ems_backend.email.EmailSender;
import com.charllson.ems_backend.exceptions.BadRequestException;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.AllArgsConstructor;


@Service
@AllArgsConstructor
public class EmailService implements EmailSender {

    
    private final JavaMailSender mailSender;
    private final static Logger LOGGER = LoggerFactory.getLogger(EmailService.class);

    @Override
    @Async
    public void send(String to, String email) {
       try {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");
        helper.setText(email, true);
        helper.setTo(to);
        helper.setSubject("Confirm your email");
        helper.setFrom("fanyicharllson@gmail.com");
        mailSender.send(mimeMessage);
        
       } catch (MessagingException e) {
         LOGGER.error("Failed to send email", e);
         throw new BadRequestException("Failed to send email");
       }
    }
    
}
