package com.winnerx0.ameri.service.impl;

import com.winnerx0.ameri.dto.UserDTO;
import com.winnerx0.ameri.dto.request.UpdateUserRequest;
import com.winnerx0.ameri.dto.response.TokenResponse;
import com.winnerx0.ameri.dto.response.UserResponse;
import com.winnerx0.ameri.model.RefreshToken;
import com.winnerx0.ameri.model.User;
import com.winnerx0.ameri.repository.RefreshTokenRepository;
import com.winnerx0.ameri.repository.UserRepository;
import com.winnerx0.ameri.service.UserService;
import com.winnerx0.ameri.utils.JwtUtils;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Date;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserResponse<UserDTO> getCurrentUser(String email) {

        User user = userRepository.findByEmail(email).orElseThrow(() -> new EntityNotFoundException("User not found"));

        UserDTO userDTO = new UserDTO();
        userDTO.setEmail(user.getEmail());
        userDTO.setGender(user.getGender());
        userDTO.setWeight(user.getWeight());
        userDTO.setHeight(user.getHeight());
        userDTO.setHealthConditions(user.getHealthConditions());
        userDTO.setUsername(user.getName());
        userDTO.setDateOfBirth(user.getDateOfBirth());
        userDTO.setGoal(user.getGoal());
        return new UserResponse<>(userDTO, "User retrieved successfully");
    }

    @Override
    public UserResponse<?> updateUserDetails(String email, UpdateUserRequest updateUserRequest){

        User user = userRepository.findByEmail(email).orElseThrow(() -> new EntityNotFoundException("User not found"));

        user.setName(Optional.ofNullable(updateUserRequest.getUsername()).orElse(user.getUsername()));
        user.setGender(Optional.ofNullable(updateUserRequest.getGender()).orElse(user.getGender()));
        user.setHealthConditions(Optional.ofNullable(updateUserRequest.getHealthConditions()).orElse(user.getHealthConditions()));
        user.setWeight(Optional.ofNullable(updateUserRequest.getWeight()).orElse(user.getWeight()));
        user.setHeight(Optional.ofNullable(updateUserRequest.getHeight()).orElse(user.getHeight()));
        user.setDateOfBirth(Optional.ofNullable(updateUserRequest.getDateOfBirth()).orElse(user.getDateOfBirth()));
        user.setGoal(Optional.ofNullable(updateUserRequest.getGoal()).orElse(user.getGoal()));
        userRepository.save(user);
        return new UserResponse<>(null, "Updated Successfully");
    }

}
