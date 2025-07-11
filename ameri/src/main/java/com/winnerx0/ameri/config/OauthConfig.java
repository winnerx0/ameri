package com.winnerx0.ameri.config;

import com.winnerx0.ameri.model.User;
import com.winnerx0.ameri.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.OAuth2AuthorizationSuccessHandler;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import java.time.LocalDate;
import java.util.Map;

@Configuration
@Slf4j
public class OauthConfig {

    private final UserRepository userRepository;

    public OauthConfig(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Bean
    public OAuth2UserService<OAuth2UserRequest, OAuth2User> oauth2UserService() {
        return (userRequest) -> {
            DefaultOAuth2UserService defaultOAuth2UserService = new DefaultOAuth2UserService();
            OAuth2User user = defaultOAuth2UserService.loadUser(userRequest);

            log.info("username {}", user.getName());

            return new DefaultOAuth2User(user.getAuthorities(), user.getAttributes(), "email");
        };
    }

    @Bean
    public OAuth2UserService<OidcUserRequest, OidcUser> oidcOauth2UserService() {
        return (userRequest) -> {
            OidcUserService defaultOAuth2UserService = new OidcUserService();
            OidcUser user = defaultOAuth2UserService.loadUser(userRequest);

            User existingUser = userRepository.findByEmail(user.getEmail()).orElseGet(() -> {
                User newUser = new User();

                newUser.setEmail(user.getEmail());
                newUser.setName(user.getName());
                newUser.setRole("USER");
                newUser.setEnabled(true);
                userRepository.save(newUser);
                return newUser;
            } );

            log.info("username {}", user.getAttributes().get("name").toString());

            log.info("user {}", existingUser.getAuthorities());

            return new DefaultOidcUser(existingUser.getAuthorities(), user.getIdToken(), user.getUserInfo(), "email");
        };
    }

    @Bean
    public AuthenticationSuccessHandler successHandler() {
        return ( request, response, authentication) -> {
            log.info("principal {}", authentication.getName());
            response.sendRedirect("/login");
        };

    }
}
