package com.winnerx0.ameri.utils;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtils jwtUtils;
    private final HandlerExceptionResolver handlerExceptionResolver;
    private final UserDetailsService userDetailsService;

    public JwtFilter(JwtUtils jwtUtils, HandlerExceptionResolver handlerExceptionResolver,
            UserDetailsService userDetailsService) {
        this.jwtUtils = jwtUtils;
        this.handlerExceptionResolver = handlerExceptionResolver;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        log.info("auth {}", request.getRequestURI());

        if (request.getRequestURI().startsWith("/api/v1/auth")) {

            filterChain.doFilter(request, response);
            return;
        }

        String authorization = request.getHeader("Authorization");

        if (authorization != null && authorization.startsWith("Bearer ")) {
            String token = authorization.substring(7);

            UserDetails userDetails = userDetailsService.loadUserByUsername(jwtUtils.extractUserData(token));

            try {
                if (userDetails != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    boolean isValid = jwtUtils.isTokenValid(token, userDetails);

                    if (isValid) {
                        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                                userDetails, null, userDetails.getAuthorities());

                        authToken.setDetails(new WebAuthenticationDetails(request));

                        SecurityContextHolder.getContext().setAuthentication(authToken);

                    }
                }

            } catch (Exception e) {
                log.error("JWT authentication failed", e);
                handlerExceptionResolver.resolveException(request, response, null, e);
                SecurityContextHolder.clearContext();
            }
        }

        filterChain.doFilter(request, response);

        log.info("done");

    }
}
