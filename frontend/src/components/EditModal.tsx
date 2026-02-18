import { useState, useEffect, useRef } from "react";
import type { Post } from "../types/types";
import Backdrop from "./Backdrop";

interface EditModalProps {
  post: Post;
  onSave: (data: { title: string; excerpt: string }) => void;
  onCancel: () => void;
}

export default function EditModal({ post, onSave, onCancel }: EditModalProps) {
  const [title, setTitle] = useState(post.title);
  const [excerpt, setExcerpt] = useState(post.excerpt);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onCancel]);

  const canSave = title.trim().length > 0;

  function handleSave() {
    if (!canSave) return;
    onSave({ title: title.trim(), excerpt: excerpt.trim() });
  }

  return (
    <>
      <Backdrop onClick={onCancel} />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="pointer-events-auto w-full max-w-md bg-[#faf9f7] rounded-2xl border border-stone-200 shadow-2xl shadow-stone-900/20 p-8 animate-modal-in">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-stone-100 border border-stone-200 flex items-center justify-center">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#78716c"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </div>
              <h2 className="font-serif text-xl text-stone-900">Edit post</h2>
            </div>

            {/* Close button */}
            <button
              onClick={onCancel}
              className="p-1.5 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors duration-150"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Fields */}
          <div className="flex flex-col gap-4 mb-7">
            <div>
              <label className="block mb-1.5 text-[11px] font-semibold uppercase tracking-widest text-stone-400">
                Title
              </label>
              <input
                ref={titleRef}
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
                placeholder="Post title…"
                className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-white text-stone-800 text-sm placeholder:text-stone-300 outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-200 transition-all duration-150"
              />
            </div>

            <div>
              <label className="block mb-1.5 text-[11px] font-semibold uppercase tracking-widest text-stone-400">
                Excerpt
              </label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Opening lines or excerpt…"
                rows={4}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-white text-stone-800 text-sm placeholder:text-stone-300 outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-200 resize-none leading-relaxed transition-all duration-150"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-lg text-sm font-medium text-stone-600 bg-white border border-stone-200 hover:bg-stone-50 transition-colors duration-150"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!canSave}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-stone-800 hover:bg-stone-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150"
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
