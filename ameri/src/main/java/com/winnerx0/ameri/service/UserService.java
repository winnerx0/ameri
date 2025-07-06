package com.winnerx0.ameri.service;

import com.winnerx0.ameri.dto.UserDTO;
import com.winnerx0.ameri.dto.request.UpdateUserRequest;
import com.winnerx0.ameri.dto.response.TokenResponse;
import com.winnerx0.ameri.dto.response.UserResponse;

public interface UserService {

    UserResponse<UserDTO> getCurrentUser(String email);

    UserResponse<?> updateUserDetails(String email, UpdateUserRequest updateUserRequest);

}
