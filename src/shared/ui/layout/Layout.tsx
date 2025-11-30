import SideBar from "../sidebar/SideBar";

export default function Layout({
  children
}: {
  children: React.ReactNode;
  headerContent: string;
}) {
  return (
    <div className="flex w-full">
      <SideBar />
      {children}
    </div>
  );
}
