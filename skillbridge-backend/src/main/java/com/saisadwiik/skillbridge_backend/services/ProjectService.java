package com.saisadwiik.skillbridge_backend.services;

import java.util.List;
import javax.management.RuntimeErrorException;

import org.jspecify.annotations.Nullable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.saisadwiik.skillbridge_backend.Enum.ProjectCategory;
import com.saisadwiik.skillbridge_backend.Enum.ProjectStatus;
import com.saisadwiik.skillbridge_backend.models.Project;
import com.saisadwiik.skillbridge_backend.models.User;
import com.saisadwiik.skillbridge_backend.repositories.ProjectRepository;
import com.saisadwiik.skillbridge_backend.repositories.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class ProjectService {
    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public Project createProject(Project project,String clientEmail){
        User client = userRepository.findByEmail(clientEmail).orElseThrow();
        if((client.getTotalBalance()-client.getLockedBalance()) < project.getBudget() ){
            throw new RuntimeException("Insufficient funds. PLease add more funds to your wallet");

        }
        client.setLockedBalance(client.getLockedBalance()+project.getBudget());
        project.setClient(client);
        return projectRepository.save(project);
        
    }
    @Transactional
    public Project updateProject(Long projectId, Project updatedDetails, String email){
        Project existing = projectRepository.findById(projectId).orElseThrow();
        if(!existing.getClient().getEmail().equals(email)) throw new RuntimeException("Unauthorized");
        if(existing.getFreelancer()!=null) throw new RuntimeException("Cannot edit: Freelancer already assigned!");
        double budgetDiff =updatedDetails.getBudget()-existing.getBudget();
        User client = existing.getClient();
        if(budgetDiff > 0 && (client.getTotalBalance()-client.getLockedBalance() < budgetDiff)){
            throw new RuntimeException("Insufficient funds. Please add more funds to your wallet");

        }
        client.setLockedBalance(client.getLockedBalance() + budgetDiff);

        existing.setTitle(updatedDetails.getTitle());
        existing.setDescription(updatedDetails.getDescription());
        existing.setBudget(updatedDetails.getBudget());
        
        return projectRepository.save(existing);
    }
    @Transactional
    public void deleteProject(Long projectId,String email){
        Project project = projectRepository.findById(projectId).orElseThrow();
        if (project.getFreelancer() != null) throw new RuntimeException("Cannot delete active contract!");

        User client = project.getClient();
        client.setLockedBalance(client.getLockedBalance() - project.getBudget());
        client.setTotalBalance(client.getTotalBalance()+project.getBudget());
        projectRepository.delete(project);
    }
    public List<Project> search(ProjectCategory category,String keyword){
        if(category !=null && keyword!=null && !keyword.isEmpty()){
            return projectRepository.findByTitleContainingIgnoreCaseAndCategory(keyword, category);
        }
        if(category!=null){
            return projectRepository.findByCategoryAndStatus(category, ProjectStatus.OPEN);
        }
        if(keyword!=null && !keyword.isEmpty()){
            return projectRepository.findByTitleContainingIgnoreCaseAndStatus(keyword,ProjectStatus.OPEN);
        }
        return projectRepository.findByStatus(ProjectStatus.OPEN);
    }



}
