package com.saisadwiik.skillbridge_backend.controllers;

import java.security.Principal;
import java.util.List;

import org.jspecify.annotations.Nullable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.saisadwiik.skillbridge_backend.DTOs.SubmissionRequest;
import com.saisadwiik.skillbridge_backend.Enum.ProjectCategory;
import com.saisadwiik.skillbridge_backend.Enum.ProjectStatus;
import com.saisadwiik.skillbridge_backend.models.Milestone;
import com.saisadwiik.skillbridge_backend.models.Project;
import com.saisadwiik.skillbridge_backend.models.User;
import com.saisadwiik.skillbridge_backend.repositories.ProjectRepository;
import com.saisadwiik.skillbridge_backend.repositories.UserRepository;
import com.saisadwiik.skillbridge_backend.services.ProjectService;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "*")
public class ProjectController {
    @Autowired
    private ProjectService projectService;
    @Autowired
    private ProjectRepository projectRepository;
    @Autowired
    private UserRepository userRepository;
    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody Project project, Principal principal){
        try {
            return ResponseEntity.ok(projectService.createProject(project, principal.getName()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @GetMapping("/my-projects")
    public ResponseEntity<List<Project>> getMyProjects(Principal principal){
        return ResponseEntity.ok(projectService.getProjectsByEmail(principal.getName()));
    }
    @GetMapping("/my-work")
    public ResponseEntity<List<Project>> getMyWork(Principal principal){
        return ResponseEntity.ok(projectService.getProjectsByFreelancer(principal.getName()));
    }
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Project project,Principal principal){
        return ResponseEntity.ok(projectService.updateProject(id, project, principal.getName()));

    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id, Principal principal){
        projectService.deleteProject(id, principal.getName());
        return ResponseEntity.ok("Project deleted and funds released.");
    }
    @GetMapping("/search")
    public ResponseEntity<Object> searchProjects(
        @RequestParam(required=false) ProjectCategory category,
        @RequestParam(required=false) String keyword
    ) {
        if(category == null && (keyword == null || keyword.isEmpty())){
            return ResponseEntity.ok(projectRepository.findByStatus(ProjectStatus.OPEN));
        }
        return ResponseEntity.ok(projectService.search(category, keyword));
    }
    @PostMapping("/{id}/release")
    public ResponseEntity<?> releaseFunds(@PathVariable Long id, Principal principal){
        try{
            projectService.releaseFunds(id,principal.getName());
            return ResponseEntity.ok("Funds Released");
        } catch(RuntimeException e){
            return ResponseEntity.badRequest().body(e.getMessage());
       }
    }
    @PostMapping("/{id}/submit")
    public ResponseEntity<?> submitWork(@PathVariable Long id,@RequestBody SubmissionRequest req,Principal principal){
        Project project=projectRepository.findById(id).orElseThrow();
        if(!project.getFreelancer().getEmail().equals(principal.getName())){
            return ResponseEntity.status(403).body("You are not authorized");
        }
        project.setSubmissionUrl(req.getUrl());
        project.setSubmissionComment(req.getComment());
        projectRepository.save(project);
        return ResponseEntity.ok("Work submitted successfully");

    }

    @PostMapping("/milestones/{id}/submit")
    public ResponseEntity<?> submitMilestoneWork(@PathVariable Long id, @RequestBody SubmissionRequest req, Principal principal) {
        try {
            projectService.submitMilestoneWork(id, req.getUrl(), req.getComment(), principal.getName());
            return ResponseEntity.ok("Milestone work submitted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/milestones/{id}/release")
    public ResponseEntity<?> releaseMilestoneFunds(@PathVariable Long id, Principal principal) {
        try {
            projectService.releaseMilestoneFunds(id, principal.getName());
            return ResponseEntity.ok("Milestone funds released");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    

    
    

}
