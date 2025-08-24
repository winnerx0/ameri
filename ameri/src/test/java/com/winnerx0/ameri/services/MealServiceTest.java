package com.winnerx0.ameri.services;

import com.winnerx0.ameri.dto.request.MealRequest;
import com.winnerx0.ameri.enums.MealType;
import com.winnerx0.ameri.model.Meal;
import com.winnerx0.ameri.model.User;
import com.winnerx0.ameri.repository.MealRepository;
import com.winnerx0.ameri.service.impl.MealServiceImpl;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentMatchers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class MealServiceTest {

    @InjectMocks
    private MealServiceImpl mealService;

    @Mock
    private MealRepository mealRepository;


    @BeforeEach
    void setUpSecurityContext() {
        Authentication mockAuth = mock(Authentication.class);
        User mockUser = new User();
        mockUser.setId("df");
        lenient().when(mockAuth.getPrincipal()).thenReturn(mockUser);

        SecurityContext mockContext = mock(SecurityContext.class);
        lenient().when(mockContext.getAuthentication()).thenReturn(mockAuth);

        SecurityContextHolder.setContext(mockContext);
    }

//    @Test
//    void logMeal_throws_when_principal_is_not_user() {
//        Authentication auth = mock(Authentication.class);
//        when(auth.getPrincipal()).thenReturn("anonymous");
//        SecurityContextHolder.getContext().setAuthentication(auth);
//
//        assertThrows(ClassCastException.class,
//                () -> mealService.logMeal(new MealRequest()));
//    }

    @Test
    void test_if_meal_is_logged() {

        MealRequest meal = mock(MealRequest.class);

        String response = mealService.logMeal(meal);

        assertEquals("Meal logged successfully", response);
    }

    @Test
    void test_if_meals_are_retrieved() {
        int pageNo = 1;
        int pageSize = 10;

        Page<Meal> mockPage = mock(Page.class);

        // Correct stubbing: repo takes userId (String) + Pageable
        when(mealRepository.findByUser(eq("df"), any(Pageable.class)))
                .thenReturn(mockPage);

        Page<Meal> result = mealService.getMeals(pageNo, pageSize);

        assertEquals(mockPage, result);

        // Verify repository interaction
        verify(mealRepository, times(1))
                .findByUser(eq("df"), eq(PageRequest.of(pageNo, pageSize)));
    }

    @Test
    void test_delete_meal(){
        Meal meal = new Meal();
        meal.setId("mockMeal");

        when(mealRepository.findById("mockMeal")).thenReturn(Optional.of(meal));

        String response = mealService.deleteMeal("mockMeal");

        assertEquals("Meal deleted successfully", response);

        verify(mealRepository, times(1)).delete(meal);

    }

    @Test
    void test_exception_is_thrown_if_meal_not_found(){

        Meal meal = new Meal();
        meal.setId("mockMeal");

        assertThrows(EntityNotFoundException.class, () ->   mealService.deleteMeal(meal.getId()));
        verify(mealRepository, never()).delete(meal);
    }

}