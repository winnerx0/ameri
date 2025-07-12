package com.winnerx0.ameri.service;

public interface OtpService {

    Integer generateToken();

    void verifyOTP(Integer otp, String email);
}
