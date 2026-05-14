package com.saisadwiik.skillbridge_backend.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.saisadwiik.skillbridge_backend.models.ChatRoom;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    Optional<ChatRoom> findByProjectIdAndClientIdAndFreelancerId(Long projectId, Long clientId, Long freelancerId);
}
