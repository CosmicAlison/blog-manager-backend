package com.alisonpariela.blogmanager.service;

import com.alisonpariela.blogmanager.model.Post;
import com.alisonpariela.blogmanager.model.User;
import com.alisonpariela.blogmanager.repository.PostRepository;
import com.alisonpariela.blogmanager.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

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
    }

    @Test
    void testSavePost() {
        Post post = new Post();
        post.setTitle("Hello");
        post.setContents("World");
        post.setUser(user);

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
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

        when(postRepository.findUserPostsOrderedByDate(anyLong(), eq(pageable))).thenReturn(page);

        Page<Post> result = postService.getUserPosts(pageable);
        assertEquals(1, result.getTotalElements());
        assertEquals("Test", result.getContent().get(0).getTitle());
    }
}
