package com.winnerx0.ameri.repository;

import com.winnerx0.ameri.model.RefreshToken;
import com.winnerx0.ameri.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, String> {

    void deleteByUser(User user);

    List<RefreshToken> findByUser(User user);

    @Query("SELECT rt FROM RefreshToken rt WHERE rt.user = :user AND rt.isBlacklisted = false")
    List<RefreshToken> findByUserAndIsNotBlacklisted(User user);

    Optional<RefreshToken> findByToken(String token);

    @Query("SELECT rt FROM RefreshToken rt WHERE rt.token = :token AND rt.isBlacklisted = false")
    Optional<RefreshToken> findByTokenAndIsNotBlacklisted(String token);

}
