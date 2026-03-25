// import SideBar from "./sidebar/SideBar";

// export default function Layout({
//   children,
// }: {
//   children: React.ReactNode;
//   headerContent: string;
// }) {
//   return (
//     <div className="flex w-full">
//       <SideBar />
//       {children}
//     </div>
//   );
// }
import SideBar from "./sidebar/SideBar";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
  headerContent: string; // HeaderContent có thể dùng để hiển thị tiêu đề động trên thanh topbar
}) {
  return (
    <div className="flex w-full h-screen overflow-hidden">
      {/* Sidebar cố định bên trái */}
      <SideBar />

      {/* Nội dung chính bên phải */}
      <main className="flex-1 overflow-y-auto bg-gray-50">{children}</main>
    </div>
  );
}
