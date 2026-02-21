package com.WTFCapestone.Capestone.exception;


/**
 * Thrown when requested resource is not found in database.
 */
public class ResourceNotFoundException extends RuntimeException{
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
