interface PaginationControlsProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export default function PaginationControls({
  page,
  totalPages,
  onChange,
}: PaginationControlsProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-1.5 py-5">
      {/* Prev */}
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="px-3 py-1.5 rounded-md text-xs font-mono border border-stone-200 bg-white text-stone-500 hover:bg-stone-50 hover:text-stone-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150"
      >
        ← prev
      </button>

      {/* Page numbers */}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={[
            "w-8 h-8 rounded-md text-xs font-mono border transition-colors duration-150",
            p === page
              ? "bg-stone-800 text-white border-stone-800"
              : "bg-white text-stone-500 border-stone-200 hover:bg-stone-50 hover:text-stone-800",
          ].join(" ")}
        >
          {p}
        </button>
      ))}

      {/* Next */}
      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="px-3 py-1.5 rounded-md text-xs font-mono border border-stone-200 bg-white text-stone-500 hover:bg-stone-50 hover:text-stone-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150"
      >
        next →
      </button>
    </div>
  );
}
