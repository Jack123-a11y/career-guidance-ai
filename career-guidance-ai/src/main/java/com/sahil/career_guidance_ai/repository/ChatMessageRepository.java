package com.sahil.career_guidance_ai.repository;

import com.sahil.career_guidance_ai.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatMessageRepository
        extends JpaRepository<ChatMessage, Long> {

    List<ChatMessage> findByUserIdOrderByCreatedAtAsc(
            Long userId
    );
}