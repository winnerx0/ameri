package com.winnerx0.ameri.repository;

import com.winnerx0.ameri.model.Otp;
import com.winnerx0.ameri.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OtpRepository extends JpaRepository<Otp, String> {

    Optional<Otp> findByOtpAndUser(Integer otp, User user);
}
