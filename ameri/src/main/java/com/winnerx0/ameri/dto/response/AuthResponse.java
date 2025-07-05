package com.winnerx0.ameri.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse<T> {
    
    private String message;

    private T data;

    private String accessToken;

    private String refreshToken;
}
