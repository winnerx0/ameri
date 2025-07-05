package com.winnerx0.ameri.service;

import com.winnerx0.ameri.dto.UserDTO;
import com.winnerx0.ameri.dto.request.LoginRequest;
import com.winnerx0.ameri.dto.request.RegisterRequest;
import com.winnerx0.ameri.dto.response.AuthResponse;

public interface AuthService {

    AuthResponse<UserDTO> register(RegisterRequest registerRequest);

    AuthResponse<UserDTO> login(LoginRequest loginRequest);

}