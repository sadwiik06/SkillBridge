package com.saisadwiik.skillbridge_backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.saisadwiik.skillbridge_backend.models.ChatMessage;

public interface ChatMessageRepository extends JpaRepository<ChatMessage,Long> {
    List<ChatMessage> findByChatRoomIdOrderByTimestampAsc(Long chatRoomId);

}
