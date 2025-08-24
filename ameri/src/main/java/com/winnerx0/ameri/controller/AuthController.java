package com.winnerx0.ameri.controller;

import com.winnerx0.ameri.dto.UserDTO;
import com.winnerx0.ameri.dto.request.*;
import com.winnerx0.ameri.dto.response.AuthResponse;
import com.winnerx0.ameri.dto.response.OtpResponse;
import com.winnerx0.ameri.dto.response.SendTokenResponse;
import com.winnerx0.ameri.dto.response.TokenResponse;
import com.winnerx0.ameri.service.AuthService;
import com.winnerx0.ameri.service.EmailService;
import com.winnerx0.ameri.service.OtpService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@Slf4j
public class AuthController {

    private final AuthService authService;
    private final OtpService otpService;
    private final EmailService emailService;

    public AuthController(AuthService authService, OtpService otpService, EmailService emailService) {
        this.authService = authService;
        this.otpService = otpService;
        this.emailService = emailService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse<UserDTO>> register(@Valid @RequestBody RegisterRequest registerRequest) {

        return ResponseEntity.ok(authService.register(registerRequest));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse<UserDTO>> login(@Valid @RequestBody LoginRequest loginRequest) {

        return ResponseEntity.ok(authService.login(loginRequest));
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<TokenResponse> refreshToken(@Valid @RequestBody RefreshTokenRequest refreshTokenRequest){
        return ResponseEntity.ok(authService.refreshToken(refreshTokenRequest));
    }

    @PostMapping("/send-verification-token")
    public ResponseEntity<SendTokenResponse> sendVerificationToken(@Valid @RequestBody SendTokenRequest sendTokenRequest){

        emailService.sendVerificationToken(sendTokenRequest.getEmail());
        return ResponseEntity.ok(new SendTokenResponse("Check your email to verify your account"));
    }

    @PostMapping("/verify-token")
    public ResponseEntity<OtpResponse> verifyOTP(@Valid @RequestBody VerifyOTPRequest verifyOTPRequest){
        otpService.verifyOTP(verifyOTPRequest.getOtp(), verifyOTPRequest.getEmail());
        return ResponseEntity.ok(new OtpResponse("Account verified please proceed to login"));
    }

    @PostMapping("/verify-account")
    public ResponseEntity<AuthResponse<String>> verifyAccount(@Valid @RequestBody VerifyAccountRequest verifyAccountRequest){
        boolean accountExists = authService.verifyAccount(verifyAccountRequest);

        if(accountExists){
            return ResponseEntity.status(HttpStatus.CONFLICT).body(new AuthResponse<>("Account already exist!", null, null));
        }
        return ResponseEntity.ok(new AuthResponse<>("Account does not exist exists!", null, null));
    }
}
