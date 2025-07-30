package com.winnerx0.ameri.utils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import com.winnerx0.ameri.dto.response.ErrorResponse;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.print.attribute.standard.Media;
import java.io.IOException;
import java.time.Duration;

@Component
@Slf4j
public class RateLimitingFilter extends OncePerRequestFilter {

    private final Cache<String, Bucket> cache;

    public RateLimitingFilter(){
        this.cache = Caffeine.newBuilder()
                .expireAfterAccess(Duration.ofMinutes(10))
                .maximumSize(1000)
                .build();
    }

    private Bucket createNewBucket() {
        Refill refill = Refill.greedy(10, Duration.ofMinutes(10));
        Bandwidth limit = Bandwidth.classic(50, refill);
        return Bucket.builder()
                .addLimit(limit)
                .build();
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        String key = request.getRemoteAddr();

        log.info("IP address {}", key);

        Bucket bucket = cache.get(key, k -> createNewBucket());

        if (bucket != null && bucket.tryConsume(1)) {
            filterChain.doFilter(request, response);
        } else {
            ObjectMapper objectMapper = new ObjectMapper();
            response.setStatus(429);
            response.addHeader("Content-Type", MediaType.APPLICATION_JSON_VALUE);
            ErrorResponse errorResponse = new ErrorResponse("Too Many Requests");
            objectMapper.writeValue(response.getWriter(), errorResponse);
        }
    }
}
