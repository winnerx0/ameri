package com.winnerx0.ameri.service.impl;

import com.winnerx0.ameri.dto.response.AuthResponse;
import com.winnerx0.ameri.model.Otp;
import com.winnerx0.ameri.model.RefreshToken;
import com.winnerx0.ameri.model.User;
import com.winnerx0.ameri.repository.OtpRepository;
import com.winnerx0.ameri.repository.RefreshTokenRepository;
import com.winnerx0.ameri.repository.UserRepository;
import com.winnerx0.ameri.service.AuthService;
import com.winnerx0.ameri.service.OtpService;
import com.winnerx0.ameri.utils.JwtUtils;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Slf4j
@Service
public class OtpServiceImpl implements OtpService {

    private final OtpRepository otpRepository;
    private final UserRepository userRepository;
    private final JwtUtils jwtUtils;
    private final RefreshTokenRepository refreshTokenRepository;

    public OtpServiceImpl(OtpRepository otpRepository, UserRepository userRepository, JwtUtils jwtUtils, RefreshTokenRepository refreshTokenRepository) {
        this.otpRepository = otpRepository;
        this.userRepository = userRepository;
        this.jwtUtils = jwtUtils;
        this.refreshTokenRepository = refreshTokenRepository;
    }

    @Override
    public Integer generateToken() {
        Random random = new Random();
        int otp = 1000 + random.nextInt(10000);
        log.info("otp {}", otp);
        return otp;
    }

    @Transactional
    @Override
    public AuthResponse verifyOTP(Integer otp, String email) {

        User user = userRepository.findByEmail(email).orElseThrow(() -> new EntityNotFoundException("User not found"));

        log.info("otp {} user {} email {}", otp, user, email);
        Otp token = otpRepository.findByOtpAndUser(otp, user.getId()).orElseThrow(() -> new IllegalArgumentException("Invalid OTP"));

        log.info("token {}", token.getOtp());

        if(token.getExpiresAt().isBefore(LocalDateTime.now())){
            otpRepository.delete(token);
            throw new IllegalArgumentException("OTP expired");
        }

        String accessToken = jwtUtils.generateAccessToken(email);
        String refreshToken = jwtUtils.generateRefreshToken(user.getId());

        RefreshToken rt = new RefreshToken();
        rt.setUser(user);
        rt.setToken(refreshToken);
        rt.setExpirationDate(LocalDateTime.now().plusDays(7));
        refreshTokenRepository.save(rt);
        user.setEnabled(true);
        userRepository.save(user);
        otpRepository.delete(token);

        return new AuthResponse("Account Verified", accessToken, refreshToken);
    }
}
