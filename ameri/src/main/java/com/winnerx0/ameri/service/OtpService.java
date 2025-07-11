package com.winnerx0.ameri.service;

public interface OtpService {

    Integer generateToken();

    boolean verifyOTP(String otp, String email);
}
