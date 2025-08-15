package com.winnerx0.ameri.controller;

import com.winnerx0.ameri.dto.UserDTO;
import com.winnerx0.ameri.dto.request.UpdateUserRequest;
import com.winnerx0.ameri.dto.response.ErrorResponse;
import com.winnerx0.ameri.dto.response.TokenResponse;
import com.winnerx0.ameri.dto.response.UserResponse;
import com.winnerx0.ameri.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/user")
@Slf4j
@Tag(name = "User Controller", description = "APIs For user management")
public class UserController {

    private final UserService userService;

    public  UserController(UserService userService) {
        this.userService = userService;
    }

    @Operation(summary = "Get logged in user information", description = "Get current logged in user in the system")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Successfully retrieved user information", content = @Content(schema = @Schema(implementation = UserResponse.class), mediaType = MediaType.APPLICATION_JSON_VALUE)),
            @ApiResponse(responseCode = "400", description = "Invalid auth token", content = @Content(schema = @Schema(implementation = ErrorResponse.class), mediaType = MediaType.APPLICATION_JSON_VALUE))
    })
    @GetMapping("/me")
    public ResponseEntity<UserResponse<UserDTO>> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails){

        return ResponseEntity.ok(userService.getCurrentUser(userDetails.getUsername()));
    }

    @PutMapping("/me")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<UserResponse<?>> updateUserDetails(@AuthenticationPrincipal UserDetails userDetails, @RequestBody UpdateUserRequest updateUserRequest){

        return ResponseEntity.ok(userService.updateUserDetails(userDetails.getUsername(), updateUserRequest));
    }
}
