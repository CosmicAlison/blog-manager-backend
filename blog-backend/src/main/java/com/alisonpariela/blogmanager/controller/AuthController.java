package com.alisonpariela.blogmanager.controller;

import com.alisonpariela.blogmanager.DTO.CreateUserRequest;
import com.alisonpariela.blogmanager.DTO.UserDTO;
import com.alisonpariela.blogmanager.model.User;
import com.alisonpariela.blogmanager.service.UserService;
import com.alisonpariela.blogmanager.security.JwtUtil;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@AllArgsConstructor
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    @PostMapping("/signup")
    public ResponseEntity<UserDTO> signup(@Valid @RequestBody CreateUserRequest request) {
        UserDTO createdUser = userService.createUser(request.getUsername(), request.getPassword(), request.getEmail());
        return ResponseEntity.ok(createdUser);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody CreateUserRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        User user = (User) authentication.getPrincipal();
        String token = jwtUtil.generateToken(user.getId().toString()); 

        return ResponseEntity.ok(new AuthResponse(token));
    }

    public static class AuthResponse {
        private final String token;

        public AuthResponse(String token) { this.token = token; }
        public String getToken() { return token; }
    }
}
