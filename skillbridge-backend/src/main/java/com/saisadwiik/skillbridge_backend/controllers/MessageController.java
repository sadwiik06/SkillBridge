package com.saisadwiik.skillbridge_backend.controllers;

import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.saisadwiik.skillbridge_backend.models.ChatMessage;
import com.saisadwiik.skillbridge_backend.repositories.ChatMessageRepository;
import com.saisadwiik.skillbridge_backend.services.ChatService;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private ChatService chatService;

    /**
     * Get message history by room ID (used internally or for future use).
     */
    @GetMapping("/{chatRoomId}")
    public ResponseEntity<List<ChatMessage>> getChatHistoryByRoom(@PathVariable Long chatRoomId) {
        return ResponseEntity.ok(chatMessageRepository.findByChatRoomIdOrderByTimestampAsc(chatRoomId));
    }

    /**
     * Get (or create) a chat room by project + client + freelancer, then return history.
     * Called from the frontend as: GET /api/messages/{projectId}/{clientId}/{freelancerId}
     */
    @GetMapping("/{projectId}/{clientId}/{freelancerId}")
    public ResponseEntity<List<ChatMessage>> getChatHistory(
            @PathVariable Long projectId,
            @PathVariable Long clientId,
            @PathVariable Long freelancerId) {

        // Get existing room or create one
        Long roomId = chatService.getRoomId(projectId, clientId, freelancerId, true);
        if (roomId == null) {
            return ResponseEntity.ok(Collections.emptyList());
        }

        return ResponseEntity.ok(chatMessageRepository.findByChatRoomIdOrderByTimestampAsc(roomId));
    }
}
