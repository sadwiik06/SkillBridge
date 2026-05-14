package com.saisadwiik.skillbridge_backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RestController;

import com.saisadwiik.skillbridge_backend.DTOs.ChatMessageDTO;
import com.saisadwiik.skillbridge_backend.models.ChatMessage;
import com.saisadwiik.skillbridge_backend.models.ChatRoom;
import com.saisadwiik.skillbridge_backend.repositories.ChatRoomRepository;
import com.saisadwiik.skillbridge_backend.services.ChatService;

@RestController
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;
    
    @Autowired
    private ChatService chatService;
    
    @Autowired
    private ChatRoomRepository roomRepo;

    public ChatController(SimpMessagingTemplate messagingTemplate){
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/chat.sendMessage")
    public void processMessage(@Payload ChatMessageDTO chatMessageDTO){
        // Ensure room exists
        Long roomId = chatService.getRoomId(
            chatMessageDTO.getProjectId(), 
            Math.min(chatMessageDTO.getSenderId(), chatMessageDTO.getRecipientId()), 
            Math.max(chatMessageDTO.getSenderId(), chatMessageDTO.getRecipientId()), 
            true
        );
        
        ChatRoom room = roomRepo.findById(roomId).orElseThrow();
        
        ChatMessage msg = new ChatMessage();
        msg.setSenderId(chatMessageDTO.getSenderId());
        msg.setRecipientId(chatMessageDTO.getRecipientId());
        msg.setContent(chatMessageDTO.getContent());
        msg.setChatRoom(room);

        // Save message via service
        ChatMessage savedMsg = chatService.sendMessage(msg);
        
        // Create response DTO to avoid JPA serialization issues over STOMP
        ChatMessageDTO responseDto = new ChatMessageDTO();
        responseDto.setId(savedMsg.getId());
        responseDto.setSenderId(savedMsg.getSenderId());
        responseDto.setRecipientId(savedMsg.getRecipientId());
        responseDto.setProjectId(room.getProject().getId());
        responseDto.setChatRoomId(room.getId());
        responseDto.setContent(savedMsg.getContent());
        responseDto.setTimestamp(savedMsg.getTimestamp());
        
        // Send to recipient
        String destination = "/topic/messages/" + chatMessageDTO.getRecipientId();
        messagingTemplate.convertAndSend(destination, responseDto);
    }
}
