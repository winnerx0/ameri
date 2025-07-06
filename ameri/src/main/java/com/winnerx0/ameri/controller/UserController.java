package com.winnerx0.ameri.controller;

import com.winnerx0.ameri.dto.request.UpdateUserRequest;
import com.winnerx0.ameri.dto.response.TokenResponse;
import com.winnerx0.ameri.dto.response.UserResponse;
import com.winnerx0.ameri.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/user")
@Slf4j
public class UserController {

    private final UserService userService;

    public  UserController(UserService userService) {
        this.userService = userService;
    }

    @PutMapping("/me")
//    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<UserResponse> updateUserDetails(@AuthenticationPrincipal UserDetails userDetails, @RequestBody UpdateUserRequest updateUserRequest){

        return ResponseEntity.ok(userService.updateUserDetails(userDetails.getUsername(), updateUserRequest));
    }

    @GetMapping("refresh-token")
    public ResponseEntity<TokenResponse> refreshToken(@RequestParam String token){
        return ResponseEntity.ok(userService.refreshToken(token));
    }
}
