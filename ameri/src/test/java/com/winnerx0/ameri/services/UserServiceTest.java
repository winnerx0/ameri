package com.winnerx0.ameri.services;

import com.winnerx0.ameri.dto.UserDTO;
import com.winnerx0.ameri.dto.request.UpdateUserRequest;
import com.winnerx0.ameri.dto.response.UserResponse;
import com.winnerx0.ameri.model.User;
import com.winnerx0.ameri.repository.UserRepository;
import com.winnerx0.ameri.service.impl.UserServiceImpl;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @InjectMocks
    private UserServiceImpl userService;

    @Mock
    private UserRepository userRepository;

    @BeforeEach
    void setUpSecurityContext() {
        Authentication mockAuth = mock(Authentication.class);
        User mockUser = new User();
        mockUser.setId("df");
        lenient().when(mockAuth.getPrincipal()).thenReturn(mockUser);

        SecurityContext mockContext = mock(SecurityContext.class);
        lenient().when(mockContext.getAuthentication()).thenReturn(mockAuth);

        SecurityContextHolder.setContext(mockContext);
    }

    @Test
    void test_if_current_logged_in_user_is_retrieved(){
        User mockUser = new User();
        mockUser.setEmail("mock@gmail.com");
        when(userRepository.findByEmail(mockUser.getEmail())).thenReturn(Optional.of(mockUser));

        UserResponse<UserDTO> response = userService.getCurrentUser(mockUser.getEmail());

        assertEquals("User retrieved successfully", response.getMessage());
    }

    @Test
    void test_if_current_logged_in_user_does_not_exist(){
        User mockUser = new User();
        mockUser.setEmail("mock@gmail.com");

        assertThrows(EntityNotFoundException.class, () -> userService.getCurrentUser(mockUser.getEmail()));

    }

    @Test
    void test_if_current_logged_in_user_data_is_updated(){
        User mockUser = new User();
        mockUser.setEmail("mock@gmail.com");
        mockUser.setName("mock");

        when(userRepository.findByEmail(mockUser.getEmail())).thenReturn(Optional.of(mockUser));

        UpdateUserRequest updateUserRequest = new UpdateUserRequest();

        updateUserRequest.setUsername("user");

        userService.updateUserDetails(mockUser.getEmail(), updateUserRequest);

        User user = userRepository.findByEmail(mockUser.getEmail()).get();

        assertEquals("user", user.getName());
        verify(userRepository).save(mockUser);
    }

    @Test
    void test_if_current_logged_in_user_does_not_exist_for_update(){
        User mockUser = new User();
        mockUser.setEmail("mock@gmail.com");

        UpdateUserRequest updateUserRequest = new UpdateUserRequest();

        updateUserRequest.setUsername("user");

        assertThrows(EntityNotFoundException.class, () -> userService.updateUserDetails(mockUser.getEmail(), updateUserRequest));

    }
}
