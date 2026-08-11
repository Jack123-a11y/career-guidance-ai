package com.sahil.career_guidance_ai.repository;

import com.sahil.career_guidance_ai.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByEmail(String email);
}