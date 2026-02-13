package com.alisonpariela.blogmanager.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.alisonpariela.blogmanager.model.Post;
import com.alisonpariela.blogmanager.service.PostService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;

import org.springframework.data.domain.Sort;
import lombok.AllArgsConstructor;

@AllArgsConstructor
@RestController
@RequestMapping("api/v1/posts")
public class PostsController {
    private final PostService postService;

    @GetMapping
    public ResponseEntity<Page<Post>> getMyPosts(
        @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC)
        Pageable pageable
    ){
        Page<Post> posts = postService.getUserPosts(pageable);
        return ResponseEntity.ok(posts);
    }

}
