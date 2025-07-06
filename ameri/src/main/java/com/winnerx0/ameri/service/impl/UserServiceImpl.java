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
        return new UserResponse<>(userDTO, null);
    }

    @Override
    public UserResponse<?> updateUserDetails(String email, UpdateUserRequest updateUserRequest){

        User user = userRepository.findByEmail(email).orElseThrow(() -> new EntityNotFoundException("User not found"));

        user.setName(updateUserRequest.getUsername());
        user.setGender(updateUserRequest.getGender());
        user.setHealthConditions(updateUserRequest.getHealthConditions());
        user.setWeight(updateUserRequest.getWeight());
        user.setHeight(updateUserRequest.getHeight());
        user.setDateOfBirth(updateUserRequest.getDateOfBirth());
        userRepository.save(user);
        return new UserResponse<>(null, "Updated Successfully");
    }

}
