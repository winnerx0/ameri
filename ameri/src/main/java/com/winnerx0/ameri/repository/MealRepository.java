package com.winnerx0.ameri.repository;

import com.winnerx0.ameri.model.Meal;
import com.winnerx0.ameri.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MealRepository extends JpaRepository<Meal, String> {

    @Query("SELECT u FROM Meal u WHERE u.user.id = :userId")
    Page<Meal> findByUser(String userId, Pageable pageable);

    @Query("SELECT m FROM Meal m WHERE m.user = :user AND m.loggedAt = :date")
    List<Meal> findAllByUserAndDate(@Param("user") User user, @Param("date") LocalDate date);

    @Query("""
            SELECT m FROM Meal m WHERE m.user = :user
            AND ( CAST(:startDate AS java.time.LocalDate) IS NULL
            OR m.loggedAt >= :startDate )
            AND ( CAST(:endDate AS java.time.LocalDate) IS NULL
            OR m.loggedAt <= :endDate )
            ORDER BY m.loggedAt DESC""")
    List<Meal> findAllByUserAndStartDateAndEndDate(@Param("user") User user, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}
