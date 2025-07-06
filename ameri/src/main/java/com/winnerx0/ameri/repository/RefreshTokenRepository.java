package com.winnerx0.ameri.repository;

import com.winnerx0.ameri.model.RefreshToken;
import com.winnerx0.ameri.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, String> {

    void deleteByUser(User user);

    RefreshToken findByUser(User user);

    Optional<RefreshToken> findByToken(String token);

}
