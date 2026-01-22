function ActionChip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-100">
      {icon}
      {label}
    </button>
  );
}
export default ActionChip;
