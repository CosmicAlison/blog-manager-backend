import { useState, useEffect, useCallback } from "react";
import type { Post } from "../types/types";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
export const POSTS_PER_PAGE = 10;

interface AddPostInput {
  title: string;
  contents: string;
}

interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
}

export function useBlog() {
  const { accessToken } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(0); 
  const [totalPages, setTotalPages] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchPosts = useCallback(async () => {
    if (!accessToken) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/posts?page=${page}&size=${POSTS_PER_PAGE}&sort=createdAt,desc`, {
        headers: { "Authorization": `Bearer ${accessToken}` },
      });

      if (!response.ok) throw new Error("Failed to fetch posts");

      const data: PageResponse<Post> = await response.json();
      setPosts(data.content);
      setTotalPages(data.totalPages);
      setTotalPosts(data.totalElements);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, page]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  async function editPost({ id, title, content }: { id: number; title: string; content: string }): Promise<void> {
    if (!accessToken) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          title: title,
          contents: content,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update post");
      }

      const updatedPost = await response.json();

      setPosts((prev) =>
        prev.map((p) => (p.id === id ? updatedPost : p))
      );
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }

  async function addPost({ title, contents }: AddPostInput): Promise<void> {
    if (!accessToken) { navigate("/login"); return; }

    try {
      const response = await fetch(`${API_URL}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ title, contents }), 
      });

      if (!response.ok) throw new Error("Failed to create post");

      const newPost = await response.json();

      setPosts((prev) => [newPost, ...prev.slice(0, POSTS_PER_PAGE - 1)]);
      setTotalPosts((prev) => prev + 1);

      if (page !== 0) {
        setPage(0);
      } else {
        fetchPosts(); 
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }

  async function deletePost(id: number): Promise<void> {
    if (!accessToken) return;
    try {
      const response = await fetch(`${API_URL}/posts/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${accessToken}` },
      });

      if (!response.ok) throw new Error("Failed to delete post");

      if (posts.length === 1 && page > 0) {
        setPage(page - 1);
      } else {
        fetchPosts(); 
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }

  return {
    posts,
    page: page + 1,
    totalPosts,
    totalPages: Math.max(1, totalPages),
    isLoading,
    error,
    addPost,
    editPost,
    deletePost,
    changePage: (p: number) => setPage(p - 1),
  };
}