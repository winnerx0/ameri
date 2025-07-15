package com.winnerx0.ameri.exception;

import lombok.Getter;
import org.springframework.http.HttpStatusCode;

@Getter
public class GeminiException extends RuntimeException {

    private final HttpStatusCode statusCode;

    public GeminiException(String message, HttpStatusCode statusCode){
        super(message);
        this.statusCode = statusCode;
    }
}

