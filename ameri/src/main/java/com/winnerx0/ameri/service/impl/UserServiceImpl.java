package com.winnerx0.ameri.service.impl;

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

    private final RefreshTokenRepository refreshTokenRepository;

    private JwtUtils jwtUtils;

    public UserServiceImpl(UserRepository userRepository, RefreshTokenRepository refreshTokenRepository, JwtUtils jwtUtils) {
        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.jwtUtils = jwtUtils;
    }

    @Override
    public UserResponse updateUserDetails(String email, UpdateUserRequest updateUserRequest){

        User user = userRepository.findByEmail(email).orElseThrow(() -> new EntityNotFoundException("User not found"));

        user.setName(updateUserRequest.getUsername());
        user.setGender(updateUserRequest.getGender());
        user.setHealthConditions(updateUserRequest.getHealthConditions());
        user.setWeight(updateUserRequest.getWeight());
        user.setHeight(updateUserRequest.getHeight());
        userRepository.save(user);
        return new UserResponse("Updated Successfully");
    }

    @Override
    public TokenResponse refreshToken(String token) {

        RefreshToken refreshToken = refreshTokenRepository.findByToken(token).orElseThrow(() -> new IllegalArgumentException("Invalid Refresh Token"));

        User user = refreshToken.getUser();

       if(refreshToken.getExpirationDate().isBefore(LocalDate.now())){
           refreshTokenRepository.delete(refreshToken);
           throw new IllegalArgumentException("Refresh token has expired");
       }
        String accessToken = jwtUtils.generateAccessToken(user.getEmail());

        return new TokenResponse(accessToken, token);
    }
}
