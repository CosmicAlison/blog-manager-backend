package com.alisonpariela.blogmanager.service;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.alisonpariela.blogmanager.model.User;
import com.alisonpariela.blogmanager.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

@AllArgsConstructor
@Service
public class UserService {
    private final UserRepository userRepository;
    private PasswordEncoder passwordEncoder;

    @Transactional
    public User saveOrUpdateUser(String username, String password, String email){
        User user = new User(); 

        user.setEmail(email);
        user.setUsername(username);        
        String encodedPassword = passwordEncoder.encode(password);
        user.setPassword(encodedPassword);

        return userRepository.save(user); 
    }

    public boolean deleteUser(Long userId){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Long authId = Long.parseLong(auth.getName());

        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found.")); 

        if (!user.getId().equals(authId)){
            throw new RuntimeException("You are not permitted to delete this user"); 
        }

        userRepository.delete(user);
        return true;
    }
}
