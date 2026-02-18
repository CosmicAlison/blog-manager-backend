import { useState, useEffect } from "react";
import type { Post } from "../types/types";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export const POSTS_PER_PAGE = 10;

function guessTag(text: string): Post["tag"] {
  const t = text.toLowerCase();
  if (t.match(/code|dev|ship|build|tech|js|css|html|api/)) return "Dev";
  if (t.match(/walk|life|feel|day|morning|night|friend|family/)) return "Life";
  return "Essay";
}

function estimateRead(text: string): string {
  const words = text.trim().split(/\s+/).length;
  return `${Math.max(1, Math.round(words / 200))} min`;
}

interface AddPostInput {
  title: string;
  excerpt: string;
}

interface EditPostInput {
  id: number;
  title: string;
  excerpt: string;
}


interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number; 
  first: boolean;
  last: boolean;
}

export function useBlog() {
  const { accessToken } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(0); 
  const [totalPages, setTotalPages] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch posts from backend with pagination
  useEffect(() => {
    async function fetchPosts() {
      if (!accessToken) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`${API_URL}/posts?page=${page}&size=${POSTS_PER_PAGE}&sort=createdAt,desc`, {
          headers: {
            "Authorization": `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }

        const data: PageResponse<Post> = await response.json();
        setPosts(data.content);
        setTotalPages(data.totalPages);
        setTotalPosts(data.totalElements);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPosts();
  }, [accessToken, page]);

  async function addPost({ title, excerpt }: AddPostInput): Promise<void> {
    const body = excerpt || "No excerpt provided.";
    
    try {
      const response = await fetch(`${API_URL}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          title,
          excerpt: body,
          tag: guessTag(title + " " + body),
          readTime: estimateRead(body),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      // Go back to first page to see the new post (posts are sorted by createdAt desc)
      setPage(0);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }

  async function editPost({ id, title, excerpt }: EditPostInput): Promise<void> {
    const body = excerpt || "No excerpt provided.";
    
    try {
      const response = await fetch(`${API_URL}/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          title,
          excerpt: body,
          tag: guessTag(title + " " + body),
          readTime: estimateRead(body),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update post");
      }

      const updatedPost = await response.json();
      // Update the post in the current page
      setPosts((prev) =>
        prev.map((p) => (p.id === id ? updatedPost : p))
      );
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }

  async function deletePost(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/posts/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete post");
      }

      const remainingOnPage = posts.length - 1;
      if (remainingOnPage === 0 && page > 0) {
        setPage(page - 1);
      } else {
        // Refresh current page
        setPosts((prev) => prev.filter((p) => p.id !== id));
        setTotalPosts((prev) => prev - 1);
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }

  function changePage(p: number): void {
    // Convert from 1-indexed (UI) to 0-indexed (Spring)
    setPage(p - 1);
  }

  return {
    posts,
    paginated: posts, // All posts on current page
    page: page + 1, // Convert back to 1-indexed for UI
    totalPosts,
    totalPages: Math.max(1, totalPages),
    isLoading,
    error,
    addPost,
    editPost,
    deletePost,
    changePage,
  };
}
