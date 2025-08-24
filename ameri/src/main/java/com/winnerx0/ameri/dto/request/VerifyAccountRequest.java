package com.winnerx0.ameri.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class VerifyAccountRequest {

    @NotBlank(message = "Email required")
    private String email;

    @NotBlank(message = "Username required")
    private String username;
}
