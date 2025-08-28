package com.winnerx0.ameri.utils;

import com.nimbusds.jose.JWEAlgorithm;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwt.*;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.security.Key;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.function.Function;

@Component
public class JwtUtils {

    private static final Logger log = LoggerFactory.getLogger(JwtUtils.class);
    @Value("${jwt.secret-key}")
    private String secretKey;

    private final long ACCESS_TOKEN_EXPIRATION = 1000 * 60 * 15;

    private final long REFRESH_TOKEN_EXPIRATION = 1000L * 60 * 60 * 24 * 30;

    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateAccessToken(String email) {
        return Jwts
                .builder()
                .subject(email)
                .signWith(getSigningKey())
                .claim("role", "ROLE_USER")
                .expiration(new Date(System.currentTimeMillis() + ACCESS_TOKEN_EXPIRATION))
                .compact();
    }

    public String generateRefreshToken(String userId) {
        return Jwts
                .builder()
                .subject(userId)
                .signWith(getSigningKey())
                .claim("role", "ROLE_USER")
                .expiration(new Date(System.currentTimeMillis() + REFRESH_TOKEN_EXPIRATION))
                .compact();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        return extractExpirationDate(token).after(new Date())
                && extractUserData(token).equals(userDetails.getUsername());
    }

    public String extractUserData(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    private Date extractExpirationDate(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts
                .parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
