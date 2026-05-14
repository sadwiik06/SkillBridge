package com.saisadwiik.skillbridge_backend.models;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="chat_messages")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessage {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    private Long senderId;
    private Long recipientId;

    @ManyToOne
    @JoinColumn(name="chat_room_id", nullable=false)
    private ChatRoom chatRoom;

    @Column(columnDefinition = "TEXT", nullable=false)
    private String content;

    private LocalDateTime timestamp = LocalDateTime.now();
    private boolean isRead = false;
}
