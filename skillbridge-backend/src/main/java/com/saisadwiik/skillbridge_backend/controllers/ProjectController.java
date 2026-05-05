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

import com.saisadwiik.skillbridge_backend.Enum.ProjectCategory;
import com.saisadwiik.skillbridge_backend.Enum.ProjectStatus;
import com.saisadwiik.skillbridge_backend.models.Project;
import com.saisadwiik.skillbridge_backend.repositories.ProjectRepository;
import com.saisadwiik.skillbridge_backend.services.ProjectService;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "*")
public class ProjectController {
    @Autowired
    private ProjectService projectService;
    @Autowired
    private ProjectRepository projectRepository;
    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody Project project, Principal principal){
        return ResponseEntity.ok(projectService.createProject(project, principal.getName()));

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
    
    

}
