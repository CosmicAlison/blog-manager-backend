interface BackdropProps {
  onClick: () => void;
}

export default function Backdrop({ onClick }: BackdropProps) {
  return (
    <div
      onClick={onClick}
      className="fixed inset-0 z-40 bg-stone-900/50 backdrop-blur-md animate-backdrop-in"
    />
  );
}
