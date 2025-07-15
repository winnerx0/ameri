package com.winnerx0.ameri.dto.request;

import com.winnerx0.ameri.annotation.PasswordMatch;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@PasswordMatch
public class LoginRequest {

    @NotBlank(message = "Email required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password required")
    @Size(min = 8, message = "Password must have at least 8 characters")
    private String password;

    @NotBlank(message = "Confirm password required")
    @Size(min = 8, message = "Password must have at least 8 characters")
    private String confirmPassword;
}
