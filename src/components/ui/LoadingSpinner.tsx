export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-2 border-[#a4ffb9]/20" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#00fd87] animate-spin" />
      </div>
    </div>
  );
}
