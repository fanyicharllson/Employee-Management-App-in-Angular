package com.charllson.ems_backend.exceptions;

public class ApiResponse {
    private boolean success;
    private String message;
    private String value;
    private String code;

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

    public boolean isSuccess() {
        return success;
    }

    public String getMessage() {
        return message;
    }

    public String getValue() {
        return value;
    }

    public String getCode() {
        return code;
    }

}
