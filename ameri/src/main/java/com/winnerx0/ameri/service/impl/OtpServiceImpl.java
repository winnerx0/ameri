package com.winnerx0.ameri.service.impl;

import com.winnerx0.ameri.service.OtpService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Random;

@Slf4j
@Service
public class OtpServiceImpl implements OtpService {

    @Override
    public Integer generateToken() {
        Random random = new Random();
        int otp = 1000 + random.nextInt(10000);
        log.info("otp {}", otp);
        return otp;
    }

    @Override
    public boolean verifyOTP(String otp, String email) {
        return false;
    }
}
