import { useState, useRef } from "react";
import type { ModalState } from "./types/types";
import { useBlog } from "./components/useBlog";
import PostCard from "./components/PostCard";
import PaginationControls from "./components/PaginationControls";
import DeleteModal from "./components/DeleteModal";
import EditModal from "./components/EditModal";

export default function BlogApp() {
  const { paginated, page, totalPosts, totalPages, addPost, editPost, deletePost, changePage } =
  useBlog();

  const [newTitle, setNewTitle] = useState("");
  const [newExcerpt, setNewExcerpt] = useState("");
  const [submitBounce, setSubmitBounce] = useState(false);
  const [modal, setModal] = useState<ModalState>({ kind: "none" });

  const listRef = useRef<HTMLDivElement>(null);
  const anyModalOpen = modal.kind !== "none";

  function handleAdd() {
    if (!newTitle.trim()) return;
    addPost({ title: newTitle.trim(), excerpt: newExcerpt.trim() });
    setNewTitle("");
    setNewExcerpt("");
    setSubmitBounce(true);
    setTimeout(() => setSubmitBounce(false), 400);
    listRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  function handleEditSave(data: { title: string; excerpt: string }) {
    if (modal.kind !== "edit") return;
    editPost({ id: modal.post.id, ...data });
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

        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes backdropIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.94) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes popBounce {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.05); }
        }

        .animate-fade-slide-in  { animation: fadeSlideIn  0.38s ease both; }
        .animate-backdrop-in    { animation: backdropIn   0.18s ease both; }
        .animate-modal-in       { animation: modalIn      0.22s cubic-bezier(.34,1.45,.64,1) both; }
        .animate-pop-bounce     { animation: popBounce    0.38s ease; }

        .font-serif { font-family: 'Playfair Display', serif; }
        .font-sans  { font-family: 'DM Sans', sans-serif; }

        ::-webkit-scrollbar       { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #d4d0ca; border-radius: 4px; }
      `}</style>

      {/* ── Modals */}
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

      {/* ── Page shell — blurs behind modal ── */}
      <div
        className={[
          "min-h-dvh bg-[#faf9f7] font-sans transition-[filter] duration-200",
          anyModalOpen ? "blur-sm brightness-95 pointer-events-none" : "",
        ].join(" ")}
      >
        {/* ════════════════════════════
            STICKY HEADER
        ════════════════════════════ */}
        <header className="sticky top-0 z-20 border-b border-stone-200 bg-[#faf9f7]/90 backdrop-blur-md">
          <div className="max-w-2xl mx-auto px-5 pt-7 pb-0">

            <div className="flex items-end justify-between mb-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone-400 mb-1">
                  personal / blog
                </p>
                <h1 className="font-serif text-[2rem] leading-none text-stone-900">
                  The Notebook
                </h1>
              </div>
              <span className="font-mono text-[11px] text-stone-400 pb-0.5">
                {totalPosts} {totalPosts === 1 ? "entry" : "entries"}
              </span>
            </div>

            <div className="border-t border-stone-200" />

            {/* Compose area */}
            <div className="py-4 flex flex-col gap-2">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone-400">
                + Add a post
              </p>

              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                placeholder="What's on your mind? Give it a title…"
                className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-white/70 text-stone-800 text-sm placeholder:text-stone-300 outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-100 transition-all duration-150"
              />

              <div className="flex gap-2">
                <textarea
                  value={newExcerpt}
                  onChange={(e) => setNewExcerpt(e.target.value)}
                  placeholder="Write a short excerpt or opening line… (optional)"
                  rows={2}
                  className="flex-1 px-3 py-2 rounded-lg border border-stone-200 bg-white/70 text-stone-800 text-sm placeholder:text-stone-300 outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-100 resize-none leading-relaxed transition-all duration-150"
                />
                <button
                  onClick={handleAdd}
                  disabled={!newTitle.trim()}
                  className={[
                    "self-stretch px-5 min-w-[90px] rounded-lg text-sm font-medium text-white",
                    "bg-stone-800 hover:bg-stone-900",
                    "disabled:bg-stone-300 disabled:cursor-not-allowed",
                    "transition-colors duration-150",
                    submitBounce ? "animate-pop-bounce" : "",
                  ].join(" ")}
                >
                  Publish
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* POST LIST*/}
        <main
          ref={listRef}
          className="max-w-2xl mx-auto px-5 pb-4"
        >
          <div className="pt-5 flex flex-col gap-3">
            {paginated.length === 0 ? (
              <div className="text-center py-20 font-mono text-sm text-stone-400">
                Nothing To See Here Yet...
              </div>
            ) : (
              paginated.map((post, i) => (
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

        {/* ════════════════════════════
            FOOTER
        ════════════════════════════ */}
        <footer className="max-w-2xl mx-auto px-5 py-6 border-t border-stone-200">
          <p className="font-mono text-[10px] text-stone-300 text-center uppercase tracking-[0.2em]">
            The Notebook · {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </div>
  );
}

