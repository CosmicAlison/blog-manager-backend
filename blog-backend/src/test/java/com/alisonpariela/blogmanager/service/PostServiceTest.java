package com.alisonpariela.blogmanager.service;

import com.alisonpariela.blogmanager.model.Post;
import com.alisonpariela.blogmanager.model.User;
import com.alisonpariela.blogmanager.repository.PostRepository;
import com.alisonpariela.blogmanager.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class PostServiceTest {

    @Mock
    private PostRepository postRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private PostService postService;

    private User user;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        user = new User();
        user.setId(1L);
        user.setUsername("testuser");

        // Set up a fake authenticated user in the security context
        UserDetails mockUserDetails = org.springframework.security.core.userdetails.User
                .withUsername("testuser")
                .password("password")
                .roles("USER")
                .build();

        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(
                        mockUserDetails, null, mockUserDetails.getAuthorities()
                );

        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void testSavePost() {
        Post post = new Post();
        post.setTitle("Hello");
        post.setContents("World");
        post.setUser(user);

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(postRepository.save(any(Post.class))).thenReturn(post);

        Post saved = postService.createPost("Hello", "World");
        assertEquals("Hello", saved.getTitle());
        assertEquals(user, saved.getUser());
    }

    @Test
    void testGetUserPosts() {
        Pageable pageable = Pageable.unpaged();
        Post post = new Post();
        post.setTitle("Test");
        Page<Post> page = new PageImpl<>(List.of(post));

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(postRepository.findUserPostsOrderedByDate(eq(1L), eq(pageable))).thenReturn(page);

        Page<Post> result = postService.getUserPosts(pageable);
        assertEquals(1, result.getTotalElements());
        assertEquals("Test", result.getContent().get(0).getTitle());
    }
}