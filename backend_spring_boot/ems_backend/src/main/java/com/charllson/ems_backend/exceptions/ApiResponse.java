package com.charllson.ems_backend.exceptions;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ApiResponse {
    private boolean success;
    private String message;
    private String value;
    private String code;
    private String token;
    private String hasAccount;
    private String isTokenUsed;


    public ApiResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public ApiResponse(boolean success, String message, String value) {
        this.success = success;
        this.message = message;
        this.value = value;
    }

    public ApiResponse(boolean success, String message, String value, String code) {
        this.success = success;
        this.message = message;
        this.value = value;
        this.code = code;
    }
    public ApiResponse(boolean success, String message, String value, String code, String token) {
        this.success = success;
        this.message = message;
        this.value = value;
        this.code = code;
        this.token = token;
    }

    public ApiResponse(boolean success, String message, String value, String code, String token, String hasAccount, String isTokenUsed) {
        this.success = success;
        this.message = message;
        this.value = value;
        this.code = code;
        this.hasAccount = hasAccount;
        this.isTokenUsed = isTokenUsed;
    }
}
