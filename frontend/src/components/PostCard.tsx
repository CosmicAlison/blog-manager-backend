import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
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

function IconButton({ title, visible, onClick, children }: IconButtonProps) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={[
        "flex items-center justify-center rounded-md",
        "border border-stone-300 bg-white text-stone-600",
        "transition-all duration-150",

        "opacity-100",
        "md:opacity-0",
        visible ? "md:opacity-100" : "",
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
          "flex rounded-[9px]",
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
                hoverClass="hover:text-stone-700 hover:border-stone-200 hover:bg-stone-50"
              >
                <Pencil className="w-3.5 h-3.5" />
              </IconButton>

              {/* Delete button */}
              <IconButton
                title="Delete post"
                visible={hovered}
                onClick={() => onDelete(post)}
                hoverClass="hover:text-stone-700 hover:border-stone-200 hover:bg-stone-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
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
