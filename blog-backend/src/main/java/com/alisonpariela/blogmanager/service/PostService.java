package com.alisonpariela.blogmanager.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.alisonpariela.blogmanager.repository.PostRepository;
import com.alisonpariela.blogmanager.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

import com.alisonpariela.blogmanager.model.Post;
import com.alisonpariela.blogmanager.model.User;
import org.springframework.security.core.Authentication;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.security.access.AccessDeniedException;

@Service
@AllArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository; 

    @Transactional
    public Post createPost(String title, String contents){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Long userId = Long.parseLong(auth.getName());

        User user = userRepository.findById(userId)
            .orElseThrow(() -> new EntityNotFoundException("User not found")); 

        Post post = new Post();
        post.setTitle(title);
        post.setContents(contents);
        post.setUser(user); 

        return postRepository.save(post);
    }

    @Transactional
    public Post updatePost(Long postId, String title, String contents){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Long userId = Long.parseLong(auth.getName());

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("Post not found"));

        if (!post.getUser().getId().equals(userId)) {
            throw new AccessDeniedException("You are not allowed to update this post"); 
        }

        post.setTitle(title);
        post.setContents(contents);

        return postRepository.save(post);
    }

    public Page<Post> getUserPosts(Pageable pageable){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Long userId = Long.parseLong(auth.getName());

        return postRepository.findUserPostsOrderedByDate(userId, pageable);
    }

    @Transactional
    public void deletePost(Long postId){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Long userId = Long.parseLong(auth.getName());

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("Post not found"));

        if (!post.getUser().getId().equals(userId)) {
            throw new AccessDeniedException("You are not allowed to delete this post"); 
        }

        postRepository.delete(post);
    }
}
