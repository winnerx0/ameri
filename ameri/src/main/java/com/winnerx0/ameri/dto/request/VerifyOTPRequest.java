package com.winnerx0.ameri.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class VerifyOTPRequest {

    @Min(value = 1000, message = "Invalid OTP")
    @Max(value = 9999, message = "Invalid OTP")
    private Integer otp;

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email required")
    private String email;
}
