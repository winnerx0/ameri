package com.winnerx0.ameri.service.impl;

import java.time.LocalDate;
import java.util.Optional;

import com.winnerx0.ameri.dto.request.RefreshTokenRequest;
import com.winnerx0.ameri.dto.response.TokenResponse;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.winnerx0.ameri.dto.UserDTO;
import com.winnerx0.ameri.dto.request.LoginRequest;
import com.winnerx0.ameri.dto.request.RegisterRequest;
import com.winnerx0.ameri.dto.response.AuthResponse;
import com.winnerx0.ameri.model.RefreshToken;
import com.winnerx0.ameri.model.User;
import com.winnerx0.ameri.repository.RefreshTokenRepository;
import com.winnerx0.ameri.repository.UserRepository;
import com.winnerx0.ameri.service.AuthService;
import com.winnerx0.ameri.utils.JwtUtils;

import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationProvider authenticationProvider;
    private final JwtUtils jwtUtils;
    private final RefreshTokenRepository refreshTokenRepository;

    public  AuthServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, AuthenticationProvider authenticationProvider, JwtUtils jwtUtils, RefreshTokenRepository refreshTokenRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationProvider = authenticationProvider;
        this.jwtUtils = jwtUtils;
        this.refreshTokenRepository = refreshTokenRepository;
    }

    @Override
    @Transactional
    public AuthResponse<UserDTO> register(RegisterRequest registerRequest) {

        Optional<User> existingUser = userRepository.findByEmail(registerRequest.getEmail());

        if(existingUser.isPresent()){
            throw new EntityExistsException("User with email already exists");
        }

        User user = new User();

        user.setEmail(registerRequest.getEmail());
        user.setName(registerRequest.getUsername());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setDateOfBirth(registerRequest.getDateOfBirth());
        user.setWeight(registerRequest.getWeight());
        user.setHeight(registerRequest.getHeight());
        user.setGender(registerRequest.getGender());
        user.setEnabled(false);
        user.setHealthConditions(registerRequest.getHealthConditions());
        user.setRole("ROLE_USER");
        User savedUser = userRepository.save(user);

        String accessToken = jwtUtils.generateAccessToken(savedUser.getEmail());
        String refreshToken = jwtUtils.generateRefreshToken(savedUser.getId());

        RefreshToken token = new RefreshToken();
        token.setToken(refreshToken);
        token.setExpirationDate(LocalDate.now().plusDays(7));

        user.setRefreshToken(token);

        userRepository.save(user);

        log.info("user {}", user);

        return new AuthResponse<>("Registration Successful, please check your email to verify your account", accessToken, refreshToken);
    }

    @Override
    @Transactional
    public AuthResponse<UserDTO> login(LoginRequest loginRequest) {

        log.info("user {}", loginRequest.getEmail());

        User user = userRepository.findByEmail(loginRequest.getEmail()).orElseThrow(() -> new EntityNotFoundException("User not found"));

        Authentication authentication = new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword());
        authenticationProvider.authenticate(authentication);

        log.info("principal {}", authentication.getPrincipal());
        log.info("credentials {}", authentication.getCredentials());

        String accessToken = jwtUtils.generateAccessToken(user.getEmail());
        String refreshToken = jwtUtils.generateRefreshToken(user.getId());

        RefreshToken token = new RefreshToken();
        token.setToken(refreshToken);
        token.setUser(user);
        token.setExpirationDate(LocalDate.now().plusDays(7));

        user.setRefreshToken(token);

        userRepository.save(user);

        log.info("user {}", user.toString());

        return new AuthResponse<>("Login Successful", accessToken, refreshToken);
    }

    @Override
    public TokenResponse refreshToken(RefreshTokenRequest refreshTokenRequest) {

        RefreshToken refreshToken = refreshTokenRepository.findByToken(refreshTokenRequest.getRefreshToken()).orElseThrow(() -> new IllegalArgumentException("Invalid Refresh Token"));

        User user = refreshToken.getUser();

        if(refreshToken.getExpirationDate().isBefore(LocalDate.now())){
            refreshTokenRepository.delete(refreshToken);
            throw new IllegalArgumentException("Refresh token has expired");
        }
        String accessToken = jwtUtils.generateAccessToken(user.getEmail());

        return new TokenResponse(accessToken, refreshTokenRequest.getRefreshToken());
    }
}
