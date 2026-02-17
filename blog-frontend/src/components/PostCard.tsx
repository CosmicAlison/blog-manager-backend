import { useState } from "react";
import type { Post } from "../types/types";

interface PostCardProps {
  post: Post;
  index: number;
  onEdit: (post: Post) => void;
  onDelete: (post: Post) => void;
}


interface IconButtonProps {
  title: string;
  visible: boolean;
  onClick: () => void;
  hoverClass: string;
  children: React.ReactNode;
}

function IconButton({ title, visible, onClick, hoverClass, children }: IconButtonProps) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={[
        "flex items-center justify-center w-7 h-7 rounded-md",
        "border border-stone-200 bg-white text-stone-400",
        "transition-all duration-150",
        hoverClass,
        visible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export default function PostCard({ post, index, onEdit, onDelete }: PostCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="animate-fade-slide-in"
      style={{ animationDelay: `${index * 55}ms`, animationFillMode: "both" }}
    >
      <div
        className={[
          "flex overflow-hidden rounded-[9px]",
          "border border-stone-200 bg-white/85 backdrop-blur-sm",
          "transition-all duration-250",
          hovered ? "-translate-y-0.5 shadow-lg shadow-stone-200/70" : "shadow-sm shadow-stone-100",
        ].join(" ")}
      >
        {/* Accent bar */}
        <div
          className={[
            "w-1 shrink-0 transition-all duration-300",
            hovered
              ? "bg-gradient-to-b from-amber-400 to-amber-500"
              : "bg-gradient-to-b from-stone-300 to-stone-200",
          ].join(" ")}
        />

        <div className="flex-1 min-w-0 px-5 py-4">
          {/* Title row */}
          <div className="flex items-start gap-2.5 mb-2">
            <h2 className="flex-1 min-w-0 font-serif text-[1.025rem] font-semibold leading-snug text-stone-800 line-clamp-2">
              {post.title}
            </h2>

            <div className="flex items-center gap-1.5 shrink-0">
              {/* Edit button */}
              <IconButton
                title="Edit post"
                visible={hovered}
                onClick={() => onEdit(post)}
                hoverClass="hover:text-stone-700 hover:border-stone-300 hover:bg-stone-50"
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </IconButton>

              {/* Delete button */}
              <IconButton
                title="Delete post"
                visible={hovered}
                onClick={() => onDelete(post)}
                hoverClass="hover:text-red-500 hover:border-red-200 hover:bg-red-50"
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                  <path d="M10 11v6M14 11v6" />
                  <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                </svg>
              </IconButton>
            </div>
          </div>

          {/* Excerpt */}
          <p className="text-sm text-stone-500 leading-relaxed line-clamp-2 mb-3">
            {post.excerpt}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-2 font-mono text-[11px] text-stone-400">
            <span>{post.date}</span>
            <span className="inline-block w-1 h-1 rounded-full bg-stone-300" />
            <span>{post.readTime} read</span>
          </div>
        </div>
      </div>
    </div>
  );
}
