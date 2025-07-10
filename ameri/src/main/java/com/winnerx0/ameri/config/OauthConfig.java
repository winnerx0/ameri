package com.winnerx0.ameri.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
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

import java.util.Map;

@Configuration
@Slf4j
public class OauthConfig {

    @Bean
    public OAuth2UserService<OAuth2UserRequest, OAuth2User> oauth2UserService() {
        return (userRequest) -> {
            DefaultOAuth2UserService defaultOAuth2UserService = new DefaultOAuth2UserService();
            OAuth2User user = defaultOAuth2UserService.loadUser(userRequest);

            log.info("username {}", user.getName());

            return new DefaultOAuth2User(user.getAuthorities(), user.getAttributes(), user.getAttributes().get("name").toString());
        };
    }

    @Bean
    public OAuth2UserService<OidcUserRequest, OidcUser> oidcOauth2UserService() {
        return (userRequest) -> {
            OidcUserService defaultOAuth2UserService = new OidcUserService();
            OidcUser user = defaultOAuth2UserService.loadUser(userRequest);

            log.info("username {}", user.getName());

            return new DefaultOidcUser(user.getAuthorities(), user.getIdToken(), user.getUserInfo(), user.getAttributes().get("name").toString());
        };
    }
}
