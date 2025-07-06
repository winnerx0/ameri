package com.winnerx0.ameri.service;

import com.winnerx0.ameri.dto.request.UpdateUserRequest;
import com.winnerx0.ameri.dto.response.TokenResponse;
import com.winnerx0.ameri.dto.response.UserResponse;

public interface UserService {

    UserResponse updateUserDetails(String email, UpdateUserRequest updateUserRequest);

    TokenResponse refreshToken(String token);
}
