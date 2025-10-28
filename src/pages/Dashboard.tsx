import { Button } from "@/shared/ui/button";
import { useState } from "react";
import { getInformationUser } from "@/features/dashboard/model/getInformationUser";

interface UserType {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function Dashboard() {
  const [dataUser, setDataUser] = useState<UserType | null>(null);

  const handleInformation = async (e: React.MouseEvent) => {
    e.preventDefault();
    await getInformationUser(setDataUser);
  };

  return (
    <div className="flex h-screen w-screen top-8 justify-between p-12">
      <div className="flex flex-col p-6 gap-5">
        <p className="text-2xl text-blue-600 font-semibold">Trang Dashboard</p>
        {dataUser && (
          <div className="flex flex-col gap-1 text-blue-500">
            <p>Thông tin user</p>
            <p>Tên : {dataUser.name}</p>
            <p>Email: {dataUser.email}</p>
            <p>Role: {dataUser.role}</p>
          </div>
        )}
      </div>
      <Button
        className="bg-blue-600 hover:bg-blue-700 text-white"
        onClick={handleInformation}
      >
        Get Information
      </Button>
    </div>
  );
}
