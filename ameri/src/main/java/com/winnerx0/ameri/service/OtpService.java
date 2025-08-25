package com.winnerx0.ameri.service;

import com.winnerx0.ameri.dto.response.AuthResponse;

public interface OtpService {

    Integer generateToken();

    AuthResponse verifyOTP(Integer otp, String email);
}
