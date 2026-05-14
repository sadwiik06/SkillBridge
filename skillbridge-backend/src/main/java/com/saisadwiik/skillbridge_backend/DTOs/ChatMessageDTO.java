package com.saisadwiik.skillbridge_backend.DTOs;

import java.time.LocalDateTime;
import lombok.Data;

@Data
public class ChatMessageDTO {
    private Long id;
    private Long senderId;
    private Long recipientId;
    private Long projectId;
    private Long chatRoomId;
    private String content;
    private LocalDateTime timestamp;
}
