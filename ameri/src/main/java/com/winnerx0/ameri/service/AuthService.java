package com.winnerx0.ameri.service;

import com.winnerx0.ameri.dto.UserDTO;
import com.winnerx0.ameri.dto.request.LoginRequest;
import com.winnerx0.ameri.dto.request.RefreshTokenRequest;
import com.winnerx0.ameri.dto.request.RegisterRequest;
import com.winnerx0.ameri.dto.request.VerifyAccountRequest;
import com.winnerx0.ameri.dto.response.AuthResponse;
import com.winnerx0.ameri.dto.response.TokenResponse;

public interface AuthService {

    AuthResponse<UserDTO> register(RegisterRequest registerRequest);

    AuthResponse<UserDTO> login(LoginRequest loginRequest);

    TokenResponse refreshToken(RefreshTokenRequest refreshTokenRequest);

    boolean verifyAccount(VerifyAccountRequest verifyAccountRequest);

}