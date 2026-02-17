package com.alisonpariela.blogmanager.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter; 

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "users")
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotNull
    private String username; 

    @NotNull
    @Email
    private String email; 

    @CreationTimestamp
    private LocalDateTime createdAt; 

    @UpdateTimestamp
    private LocalDateTime lastUpdatedAt;  

    @NotNull
    private String password;
}
