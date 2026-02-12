package com.alisonpariela.blogmanager.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter; 

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotNull
    private String firstName; 

    @NotNull
    private String lastName; 

    @NotNull
    @Email
    private String email; 

    @CreationTimestamp
    private LocalDateTime createdAt; 

    @UpdateTimestamp
    private LocalDateTime lastUpdatedAt;  
}
