package com.alisonpariela.blogmanager.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/posts")
public class PostsController {

    @GetMapping("/")
    public String getPostsString(){
        return "";
    }

    

}
