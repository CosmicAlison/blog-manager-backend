import { useState } from "react";
import type { Post } from "../types/types";

const SEED_POSTS: Post[] = [
  { id: 1, title: "The Art of Slow Thinking", excerpt: "In a world optimised for speed, deliberate thought is the ultimate act of rebellion. We've been conditioned to equate quickness with intelligence, but the best ideas often arrive late.", date: "Feb 12, 2026", tag: "Essay", readTime: "5 min" },
  { id: 2, title: "Building in the Open", excerpt: "Shipping in public is terrifying. It means your half-finished ideas are visible. It means your mistakes are logged. It also means every small win becomes a shared celebration.", date: "Feb 10, 2026", tag: "Dev", readTime: "3 min" },
  { id: 3, title: "On Walking Without a Destination", excerpt: "The Japanese have a concept — aimless wandering that clears the mind. No AirPods, no podcast, no agenda. Just streets and sky and the quiet hum of being somewhere.", date: "Feb 7, 2026", tag: "Life", readTime: "4 min" },
  { id: 4, title: "Why I Deleted My Notion", excerpt: "Productivity systems are a form of procrastination with better aesthetics. I spent three years building the perfect second brain and produced almost nothing inside it.", date: "Feb 3, 2026", tag: "Essay", readTime: "6 min" },
  { id: 5, title: "The Camera Roll as Archive", excerpt: "Every photograph is a small act of grieving — you are acknowledging that this moment, unrepeatable, is already passing as you press the shutter.", date: "Jan 29, 2026", tag: "Life", readTime: "3 min" },
  { id: 6, title: "Static Sites and the Joy of Boring Tech", excerpt: "New frameworks promise salvation. But a plain HTML file served from a CDN has never betrayed me. Boring technology is a feature, not a flaw.", date: "Jan 24, 2026", tag: "Dev", readTime: "4 min" },
  { id: 7, title: "Reading in Cursive", excerpt: "Handwriting slows you down. Slowing down makes you notice. Noticing makes you remember. There's a case to be made for analog annotation in a digital reading life.", date: "Jan 20, 2026", tag: "Essay", readTime: "5 min" },
  { id: 8, title: "The Algorithm Doesn't Know You", excerpt: "It knows your patterns. It knows your triggers. But the self that sits outside your habits — the version of you that surprises even yourself — remains invisible to it.", date: "Jan 15, 2026", tag: "Life", readTime: "4 min" },
];

export const POSTS_PER_PAGE = 4;

function getToday(): string {
  return new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

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

export function useBlog() {
  const [posts, setPosts] = useState<Post[]>(SEED_POSTS);
  const [page, setPage] = useState(1);

  const totalPosts = posts.length;
  const totalPages = Math.max(1, Math.ceil(totalPosts / POSTS_PER_PAGE));
  const paginated = posts.slice(
    (page - 1) * POSTS_PER_PAGE,
    page * POSTS_PER_PAGE
  );

  function addPost({ title, excerpt }: AddPostInput): void {
    const body = excerpt || "No excerpt provided.";
    const post: Post = {
      id: Date.now(),
      title,
      excerpt: body,
      date: getToday(),
      tag: guessTag(title + " " + body),
      readTime: estimateRead(body),
    };
    setPosts((prev) => [post, ...prev]);
    setPage(1);
  }

  function editPost({ id, title, excerpt }: EditPostInput): void {
    const body = excerpt || "No excerpt provided.";
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              title,
              excerpt: body,
              tag: guessTag(title + " " + body),
              readTime: estimateRead(body),
            }
          : p
      )
    );
  }

  function deletePost(id: number): void {
    const remaining = posts.filter((p) => p.id !== id);
    const maxPage = Math.max(1, Math.ceil(remaining.length / POSTS_PER_PAGE));
    setPosts(remaining);
    setPage((p) => Math.min(p, maxPage));
  }

  function changePage(p: number): void {
    setPage(Math.max(1, Math.min(p, totalPages)));
  }

  return {
    posts,
    paginated,
    page,
    totalPosts,
    totalPages,
    addPost,
    editPost,
    deletePost,
    changePage,
  };
}
