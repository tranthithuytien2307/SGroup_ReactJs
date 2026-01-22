function UserChip({ name, removable }: { name: string; removable?: boolean }) {
  return (
    <div className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-sm">
      <div className="h-5 w-5 rounded-full bg-gray-300 flex items-center justify-center text-xs">
        {name[0]}
      </div>
      {name}
      {removable && (
        <button className="ml-1 text-gray-400 hover:text-gray-600">×</button>
      )}
    </div>
  );
}
export default UserChip;
