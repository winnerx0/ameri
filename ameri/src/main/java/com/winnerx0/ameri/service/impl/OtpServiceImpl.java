package com.winnerx0.ameri.service.impl;

import com.winnerx0.ameri.model.Otp;
import com.winnerx0.ameri.model.User;
import com.winnerx0.ameri.repository.OtpRepository;
import com.winnerx0.ameri.repository.UserRepository;
import com.winnerx0.ameri.service.OtpService;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Slf4j
@Service
public class OtpServiceImpl implements OtpService {

    private final OtpRepository otpRepository;
    private final UserRepository userRepository;

    public OtpServiceImpl(OtpRepository otpRepository, UserRepository userRepository) {
        this.otpRepository = otpRepository;
        this.userRepository = userRepository;
    }

    @Override
    public Integer generateToken() {
        Random random = new Random();
        int otp = 1000 + random.nextInt(10000);
        log.info("otp {}", otp);
        return otp;
    }

    @Override
    public void verifyOTP(Integer otp, String email) {

        User user = userRepository.findByEmail(email).orElseThrow(() -> new EntityNotFoundException("User not found"));

        Otp token = otpRepository.findByOtpAndUser(otp, user).orElseThrow(() -> new IllegalArgumentException("Invalid OTP"));

        log.info("token {}", token.getOtp());

        if(token.getExpiresAt().isBefore(LocalDateTime.now())){
            user.setOtp(null);
            userRepository.save(user);
            throw new IllegalArgumentException("OTP expired");
        }

        user.setEnabled(true);
        userRepository.save(user);
    }
}
