package com.winnerx0.ameri.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SendTokenRequest {

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email required")
    private String email;
}
