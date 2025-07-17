package com.winnerx0.ameri.repository;

import com.winnerx0.ameri.model.Meal;
import com.winnerx0.ameri.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface MealRepository extends JpaRepository<Meal, String> {

    @Query("SELECT u FROM Meal u WHERE u.user.id = :userId")
    Page<Meal> findByUser(String userId, Pageable pageable);
}
