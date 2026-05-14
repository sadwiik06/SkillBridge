package com.saisadwiik.skillbridge_backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.saisadwiik.skillbridge_backend.models.ChatMessage;
import com.saisadwiik.skillbridge_backend.models.ChatRoom;
import com.saisadwiik.skillbridge_backend.models.Project;
import com.saisadwiik.skillbridge_backend.models.User;
import com.saisadwiik.skillbridge_backend.repositories.ChatMessageRepository;
import com.saisadwiik.skillbridge_backend.repositories.ChatRoomRepository;
import com.saisadwiik.skillbridge_backend.repositories.ProjectRepository;
import com.saisadwiik.skillbridge_backend.repositories.UserRepository;

@Service
public class ChatService {
    @Autowired
    private ChatRoomRepository roomRepo;
    
    @Autowired 
    private ChatMessageRepository msgRepo;

    @Autowired
    private ProjectRepository projectRepo;

    @Autowired
    private UserRepository userRepo;

    public Long getRoomId(Long projectId, Long clientId, Long freelancerId, boolean createIfNotExist){
        return roomRepo.findByProjectIdAndClientIdAndFreelancerId(projectId, clientId, freelancerId)
        .map(ChatRoom::getId)
        .orElseGet(() -> {
            if (!createIfNotExist) {
                return null;
            }
            
            Project project = projectRepo.findById(projectId)
                .orElseThrow(() -> new IllegalArgumentException("Project not found with id: " + projectId));
            User client = userRepo.findById(clientId)
                .orElseThrow(() -> new IllegalArgumentException("Client not found with id: " + clientId));
            User freelancer = userRepo.findById(freelancerId)
                .orElseThrow(() -> new IllegalArgumentException("Freelancer not found with id: " + freelancerId));

            ChatRoom newRoom = new ChatRoom();
            newRoom.setProject(project);
            newRoom.setClient(client);
            newRoom.setFreelancer(freelancer);
            
            return roomRepo.save(newRoom).getId();
        });
    }

    public ChatMessage sendMessage(ChatMessage message){
        return msgRepo.save(message);
    }
}
