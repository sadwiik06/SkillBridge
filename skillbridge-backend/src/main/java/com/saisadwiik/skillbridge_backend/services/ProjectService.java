package com.saisadwiik.skillbridge_backend.services;

import java.util.List;


import org.jspecify.annotations.Nullable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.saisadwiik.skillbridge_backend.Enum.ProjectCategory;
import com.saisadwiik.skillbridge_backend.Enum.ProjectStatus;
import com.saisadwiik.skillbridge_backend.models.Milestone;
import com.saisadwiik.skillbridge_backend.models.Project;
import com.saisadwiik.skillbridge_backend.models.Transaction;
import com.saisadwiik.skillbridge_backend.models.User;
import com.saisadwiik.skillbridge_backend.repositories.MilestoneRepository;
import com.saisadwiik.skillbridge_backend.repositories.ProjectRepository;
import com.saisadwiik.skillbridge_backend.repositories.TransactionRepository;
import com.saisadwiik.skillbridge_backend.repositories.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class ProjectService {
    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private TransactionRepository transactionRepository;
    @Autowired
    private MilestoneRepository milestoneRepository;

    @Transactional
    public Project createProject(Project project,String clientEmail){
        User client = userRepository.findByEmail(clientEmail).orElseThrow();
        double currentTotal = client.getTotalBalance() != null ? client.getTotalBalance() : 0.0;
        double currentLocked = client.getLockedBalance() != null ? client.getLockedBalance() : 0.0;
        if((currentTotal - currentLocked) < project.getBudget() ){
            throw new RuntimeException("Insufficient funds. Please add more funds to your wallet");
        }
        client.setLockedBalance(currentLocked + project.getBudget());
        
        Transaction tx=new Transaction();
        tx.setUser(client);
        tx.setAmount(project.getBudget());
        tx.setType("ESCROW_LOCK");
        tx.setDescription("Funds locked for project: "+project.getTitle());
        transactionRepository.save(tx);
        
        project.setClient(client);
        project.setStatus(ProjectStatus.OPEN);
        
        if(project.getMilestones() != null){
            for(Milestone m : project.getMilestones()){
                m.setProject(project);
                m.setStatus("PENDING");
            }
        }
        
        return projectRepository.save(project);
    }
    @Transactional
    public Project updateProject(Long projectId, Project updatedDetails, String email){
        Project existing = projectRepository.findById(projectId).orElseThrow();
        if(!existing.getClient().getEmail().equals(email)) throw new RuntimeException("Unauthorized");
        if(existing.getFreelancer()!=null) throw new RuntimeException("Cannot edit: Freelancer already assigned!");
        double budgetDiff =updatedDetails.getBudget()-existing.getBudget();
        User client = existing.getClient();
        double currentTotal = client.getTotalBalance() != null ? client.getTotalBalance() : 0.0;
        double currentLocked = client.getLockedBalance() != null ? client.getLockedBalance() : 0.0;
        if(budgetDiff > 0 && (currentTotal - currentLocked < budgetDiff)){
            throw new RuntimeException("Insufficient funds. Please add more funds to your wallet");

        }
        client.setLockedBalance(currentLocked + budgetDiff);

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
        double currentTotal = client.getTotalBalance() != null ? client.getTotalBalance() : 0.0;
        double currentLocked = client.getLockedBalance() != null ? client.getLockedBalance() : 0.0;
        client.setLockedBalance(currentLocked - project.getBudget());
        client.setTotalBalance(currentTotal + project.getBudget());
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
    public List<Project> getProjectsByEmail(String name){
        User client = userRepository.findByEmail(name).orElseThrow(() -> new RuntimeException("User not found"));
        return projectRepository.findByClient(client);
    }
    @Transactional
    public void completeProject(Long projectId,String clientEmail){
        Project project=projectRepository.findById(projectId).orElseThrow();
        if(!project.getClient().getEmail().equals(clientEmail)) throw new RuntimeException("Unauthorized");
        User client=project.getClient();
        User freelancer=project.getFreelancer();
        double clientTotal = client.getTotalBalance() != null ? client.getTotalBalance() : 0.0;
        double clientLocked = client.getLockedBalance() != null ? client.getLockedBalance() : 0.0;
        client.setTotalBalance(clientTotal - project.getBudget());
        client.setLockedBalance(clientLocked - project.getBudget());

        double freelancerTotal = freelancer.getTotalBalance() != null ? freelancer.getTotalBalance() : 0.0;
        freelancer.setTotalBalance(freelancerTotal + project.getBudget());
        project.setStatus(ProjectStatus.COMPLETED);
        userRepository.save(client);
        userRepository.save(freelancer);
        projectRepository.save(project);
    }
    @Transactional
    public void releaseFunds(Long projectId,String clientEmail){
        Project project = projectRepository.findById(projectId).orElseThrow(() -> new RuntimeException("Project not found"));
        if(!project.getClient().getEmail().equals(clientEmail)) throw new RuntimeException("Unauthorized");
        if(project.getStatus()!=ProjectStatus.IN_PROGRESS) throw new RuntimeException("Project must be Assigned a freelancer");
        User client=project.getClient();
        User freelancer=project.getFreelancer();
        Double amount = project.getBudget();
        //deduct from client side
        double clientTotal = client.getTotalBalance() != null ? client.getTotalBalance() : 0.0;
        double clientLocked = client.getLockedBalance() != null ? client.getLockedBalance() : 0.0;
        client.setTotalBalance(clientTotal - amount);
        client.setLockedBalance(clientLocked - amount);
        
        

        //add to freelancer side
        double freelancerTotal = freelancer.getTotalBalance() != null ? freelancer.getTotalBalance() : 0.0;
        freelancer.setTotalBalance(freelancerTotal + amount);
        project.setStatus(ProjectStatus.COMPLETED);
        Transaction tx=new Transaction();
        tx.setUser(freelancer);
        tx.setAmount(project.getBudget());
        tx.setType("PAYMENT_RECEIVED");
        tx.setDescription("Payment received for project " + project.getTitle());
        transactionRepository.save(tx);
        userRepository.save(client);
        userRepository.save(freelancer);
        projectRepository.save(project);


    }

    public List<Project> getProjectsByFreelancer(String email){
        User freelancer = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        return projectRepository.findByFreelancer(freelancer);
    }
    public  Project createProjectWithMilestones(Project project, List<Milestone> milestoneList){
        Project savedProject = projectRepository.save(project);
        for (Milestone m: milestoneList){
            m.setProject(savedProject);
            m.setStatus("PENDING");
            milestoneRepository.save(m);
        }
        return savedProject;
        
    }

    @Transactional
    public void submitMilestoneWork(Long milestoneId, String url, String comment, String email) {
        Milestone milestone = milestoneRepository.findById(milestoneId).orElseThrow(() -> new RuntimeException("Milestone not found"));
        if (!milestone.getProject().getFreelancer().getEmail().equals(email)) {
            throw new RuntimeException("Unauthorized");
        }
        milestone.setSubmissionUrl(url);
        milestone.setSubmissionComment(comment);
        milestone.setStatus("SUBMITTED");
        milestoneRepository.save(milestone);
    }

    @Transactional
    public void releaseMilestoneFunds(Long milestoneId, String clientEmail) {
        Milestone milestone = milestoneRepository.findById(milestoneId).orElseThrow(() -> new RuntimeException("Milestone not found"));
        Project project = milestone.getProject();
        
        if (!project.getClient().getEmail().equals(clientEmail)) {
            throw new RuntimeException("Unauthorized");
        }
        if (!"SUBMITTED".equals(milestone.getStatus())) {
            throw new RuntimeException("Milestone not submitted yet");
        }

        User client = project.getClient();
        User freelancer = project.getFreelancer();
        Double amount = milestone.getAmount();

        // deduct from client
        double clientTotal = client.getTotalBalance() != null ? client.getTotalBalance() : 0.0;
        double clientLocked = client.getLockedBalance() != null ? client.getLockedBalance() : 0.0;
        client.setTotalBalance(clientTotal - amount);
        client.setLockedBalance(clientLocked - amount);

        // add to freelancer
        double freelancerTotal = freelancer.getTotalBalance() != null ? freelancer.getTotalBalance() : 0.0;
        freelancer.setTotalBalance(freelancerTotal + amount);
        
        milestone.setStatus("COMPLETED");
        
        Transaction tx = new Transaction();
        tx.setUser(freelancer);
        tx.setAmount(amount);
        tx.setType("PAYMENT_RECEIVED");
        tx.setDescription("Payment received for milestone: " + milestone.getTitle() + " in project " + project.getTitle());
        transactionRepository.save(tx);
        
        userRepository.save(client);
        userRepository.save(freelancer);
        milestoneRepository.save(milestone);

        // check if all milestones are completed to mark project as completed
        boolean allCompleted = true;
        for (Milestone m : project.getMilestones()) {
            if (!"COMPLETED".equals(m.getStatus())) {
                allCompleted = false;
                break;
            }
        }
        if (allCompleted) {
            project.setStatus(ProjectStatus.COMPLETED);
            projectRepository.save(project);
        }
    }
}
