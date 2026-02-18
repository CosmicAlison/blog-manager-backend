import { useState, useRef } from "react";
import type { ModalState } from "./types/types";
import { useBlog } from "./components/useBlog"; 
import PostCard from "./components/PostCard";
import PaginationControls from "./components/PaginationControls";
import DeleteModal from "./components/DeleteModal";
import EditModal from "./components/EditModal";

export default function BlogApp() {
  const { 
    posts, 
    page, 
    totalPosts, 
    totalPages, 
    addPost, 
    editPost, 
    deletePost, 
    changePage 
  } = useBlog();

  const [newTitle, setNewTitle] = useState("");
  const [newExcerpt, setNewExcerpt] = useState(""); 
  const [submitBounce, setSubmitBounce] = useState(false);
  const [modal, setModal] = useState<ModalState>({ kind: "none" });

  const listRef = useRef<HTMLDivElement>(null);
  const anyModalOpen = modal.kind !== "none";

  function handleAdd() {
    if (!newTitle.trim()) return;
    
    addPost({ 
      title: newTitle.trim(), 
      contents: newExcerpt.trim() || "No content provided." 
    });

    setNewTitle("");
    setNewExcerpt("");
    setSubmitBounce(true);
    setTimeout(() => setSubmitBounce(false), 400);
    listRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  function handleEditSave(data: { title: string; excerpt: string }) {
    if (modal.kind !== "edit") return;
    
    editPost({ id: modal.post.id, title: data.title, content: data.excerpt });
    setModal({ kind: "none" });
  }

  function handleDeleteConfirm() {
    if (modal.kind !== "delete") return;
    deletePost(modal.post.id);
    setModal({ kind: "none" });
  }

  function handlePageChange(p: number) {
    changePage(p);
    listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="min-h-screen w-full bg-[#faf9f7] font-sans transition-[filter] duration-200">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500&display=swap');
        /* ... animation keyframes ... */
      `}</style>

      {modal.kind === "delete" && (
        <DeleteModal
          post={modal.post}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setModal({ kind: "none" })}
        />
      )}
      {modal.kind === "edit" && (
        <EditModal
          post={modal.post}
          onSave={handleEditSave}
          onCancel={() => setModal({ kind: "none" })}
        />
      )}

      <div className={[
          "min-h-dvh bg-[#faf9f7] font-sans transition-[filter] duration-200",
          anyModalOpen ? "blur-sm brightness-95 pointer-events-none" : "",
        ].join(" ")}
      >
        <header className="sticky top-0 z-20 border-b border-stone-200 bg-[#faf9f7]/90 backdrop-blur-md">
          <div className="max-w-2xl mx-auto px-5 pt-7 pb-0">
            <div className="flex items-end justify-between mb-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone-400 mb-1">personal / blog</p>
                <h1 className="font-serif text-[2rem] leading-none text-stone-900">The Daily Blogger</h1>
              </div>
              <span className="font-mono text-[11px] text-stone-400 pb-0.5">
                {totalPosts} {totalPosts === 1 ? "entry" : "entries"}
              </span>
            </div>
            <div className="border-t border-stone-200" />
            
            <div className="py-4 flex flex-col gap-2">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone-400">+ Add a post</p>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                placeholder="Title..."
                className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-white/70 text-sm outline-none focus:border-stone-400"
              />
              <div className="flex gap-2">
                <textarea
                  value={newExcerpt}
                  onChange={(e) => setNewExcerpt(e.target.value)}
                  placeholder="Content..."
                  rows={2}
                  className="flex-1 px-3 py-2 rounded-lg border border-stone-200 bg-white/70 text-sm outline-none resize-none"
                />
                <button
                  onClick={handleAdd}
                  disabled={!newTitle.trim()}
                  className={`self-stretch px-5 min-w-[90px] rounded-lg text-sm font-medium text-white bg-stone-800 hover:bg-stone-900 transition-all ${submitBounce ? 'animate-pop-bounce' : ''}`}
                >
                  Publish
                </button>
              </div>
            </div>
          </div>
        </header>

        <main ref={listRef} className="max-w-2xl mx-auto px-5 pb-4">
          <div className="pt-5 flex flex-col gap-3">

            {posts.length === 0 ? (
              <div className="text-center py-20 font-mono text-sm text-stone-400">Nothing To See Here Yet...</div>
            ) : (
              posts.map((post, i) => (
                <PostCard
                  key={post.id}
                  post={post}
                  index={i}
                  onEdit={(p) => setModal({ kind: "edit", post: p })}
                  onDelete={(p) => setModal({ kind: "delete", post: p })}
                />
              ))
            )}
          </div>

          <PaginationControls
            page={page}
            totalPages={totalPages}
            onChange={handlePageChange}
          />
        </main>
      </div>
    </div>
  );
}