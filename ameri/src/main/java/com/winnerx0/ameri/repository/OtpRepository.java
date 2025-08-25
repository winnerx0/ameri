package com.winnerx0.ameri.repository;

import com.winnerx0.ameri.model.Otp;
import com.winnerx0.ameri.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OtpRepository extends JpaRepository<Otp, String> {

    @Query("SELECT o FROM Otp o WHERE o.otp = :otp AND o.user.id = :userId")
    Optional<Otp> findByOtpAndUser(Integer otp, String userId);

    Optional<Otp> findByUser(User user);
}
