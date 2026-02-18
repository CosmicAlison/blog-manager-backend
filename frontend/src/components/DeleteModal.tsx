import { useEffect } from "react";
import type { Post } from "../types/types";
import Backdrop from "./Backdrop";

interface DeleteModalProps {
  post: Post;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteModal({ post, onConfirm, onCancel }: DeleteModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onCancel]);

  return (
    <>
      <Backdrop onClick={onCancel} />

      {/* Modal centering shell */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="pointer-events-auto w-full max-w-sm bg-[#faf9f7] rounded-2xl border border-stone-200 shadow-2xl shadow-stone-900/20 p-8 animate-modal-in">

          {/* Trash icon */}
          <div className="w-11 h-11 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mb-5">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ef4444"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
            </svg>
          </div>

          <h2 className="font-serif text-xl text-stone-900 mb-2">
            Delete this post?
          </h2>
          <p className="text-sm text-stone-500 leading-relaxed mb-7">
            <span className="font-medium text-stone-700">"{post.title}"</span>{" "}
            will be permanently removed. This cannot be undone.
          </p>

          <div className="flex items-center justify-end gap-2">
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-lg text-sm font-medium text-stone-600 bg-white border border-stone-200 hover:bg-stone-50 transition-colors duration-150"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors duration-150"
            >
              Delete post
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
