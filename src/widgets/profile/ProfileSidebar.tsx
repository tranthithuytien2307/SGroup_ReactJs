import { User, Settings, Crown } from "lucide-react";

const ProfileSidebar = () => {
  return (
    <div className="w-[260px] bg-white border-r p-4 space-y-4">
      <h2 className="text-lg font-semibold">Tài khoản</h2>

      <SidebarItem icon={<User />} title="Thành viên" active />
      <SidebarItem icon={<Settings />} title="Cài đặt" />
      <SidebarItem icon={<Crown />} title="Nâng cấp Không gian làm việc" />
    </div>
  );
};

const SidebarItem = ({ icon, title, active }: any) => (
  <div
    className={`flex items-center gap-3 p-2 rounded cursor-pointer ${
      active ? "bg-gray-100 font-medium" : "hover:bg-gray-50"
    }`}
  >
    {icon}
    <span>{title}</span>
  </div>
);

export default ProfileSidebar;
