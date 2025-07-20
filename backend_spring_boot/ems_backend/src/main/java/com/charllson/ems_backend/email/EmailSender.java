package com.charllson.ems_backend.email;

public interface EmailSender {
    void send(String to, String email);
}
