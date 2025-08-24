package com.winnerx0.ameri.service.impl;

import java.sql.Ref;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import com.winnerx0.ameri.dto.request.RefreshTokenRequest;
import com.winnerx0.ameri.dto.request.VerifyAccountRequest;
import com.winnerx0.ameri.dto.response.TokenResponse;
import com.winnerx0.ameri.model.Otp;
import com.winnerx0.ameri.repository.OtpRepository;
import com.winnerx0.ameri.service.EmailService;
import com.winnerx0.ameri.service.OtpService;
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
    private final EmailService emailService;

    public  AuthServiceImpl(UserRepository userRepository,
                            PasswordEncoder passwordEncoder,
                            AuthenticationProvider authenticationProvider,
                            JwtUtils jwtUtils,
                            RefreshTokenRepository refreshTokenRepository,
                            EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationProvider = authenticationProvider;
        this.jwtUtils = jwtUtils;
        this.refreshTokenRepository = refreshTokenRepository;
        this.emailService = emailService;
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
        user.setGoal(registerRequest.getGoal());

        userRepository.save(user);

        emailService.sendVerificationToken(user.getEmail());

        log.info("user {}", user);

        return new AuthResponse<>("Registration Successful, please check your email to verify your account", null, null);
    }

    @Override
    @Transactional
    public AuthResponse<UserDTO> login(LoginRequest loginRequest) {

        log.info("user {}", loginRequest.getEmail());

        User user = userRepository.findByEmail(loginRequest.getEmail()).orElseThrow(() -> new EntityNotFoundException("User not found"));

        List<RefreshToken> oldTokens = refreshTokenRepository.findByUser(user);

        // black list all the previous tokens;
        if(oldTokens != null && !oldTokens.isEmpty()){
            oldTokens.forEach(token -> {
                token.setIsBlacklisted(true);
                refreshTokenRepository.save(token);
            });
        }

        Authentication authentication = new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword());
        authenticationProvider.authenticate(authentication);

        log.info("principal {}", authentication.getPrincipal());
        log.info("credentials {}", authentication.getCredentials());

        String accessToken = jwtUtils.generateAccessToken(user.getEmail());
        String refreshToken = jwtUtils.generateRefreshToken(user.getId());

        RefreshToken token = new RefreshToken();
        token.setToken(refreshToken);
        token.setUser(user);
        token.setExpirationDate(LocalDateTime.now().plusDays(7));

        refreshTokenRepository.save(token);

        return new AuthResponse<>("Login Successful", accessToken, refreshToken);
    }

    @Override
    @Transactional
    public TokenResponse refreshToken(RefreshTokenRequest refreshTokenRequest) {

        RefreshToken old = refreshTokenRepository.findByTokenAndIsNotBlacklisted(refreshTokenRequest.getRefreshToken()).orElseThrow(() -> new IllegalArgumentException("Invalid Refresh Token"));

        User user = old.getUser();

        if(old.getExpirationDate().isBefore(LocalDateTime.now())){
            throw new IllegalArgumentException("Refresh token has expired");
        }
        old.setIsBlacklisted(true);
        refreshTokenRepository.save(old);
        String accessToken = jwtUtils.generateAccessToken(user.getEmail());
        String newRefreshToken = jwtUtils.generateRefreshToken(user.getId());

        RefreshToken newToken = new RefreshToken();
        newToken.setToken(newRefreshToken);
        newToken.setExpirationDate(LocalDateTime.now().plusDays(7));
        newToken.setUser(user);

        refreshTokenRepository.save(newToken);


        return new TokenResponse(accessToken, newRefreshToken);
    }

    @Override
    public boolean verifyAccount(VerifyAccountRequest verifyAccountRequest) {
        return userRepository.existsByEmailOrName(verifyAccountRequest.getEmail(), verifyAccountRequest.getUsername());

    }
}
