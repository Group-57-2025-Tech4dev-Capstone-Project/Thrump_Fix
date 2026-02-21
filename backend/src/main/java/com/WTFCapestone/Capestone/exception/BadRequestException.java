package com.WTFCapestone.Capestone.exception;


/**
 * Used for validation and logical errors.
 */
public class BadRequestException extends RuntimeException{
    public BadRequestException(String message) {
        super(message);
    }
}
