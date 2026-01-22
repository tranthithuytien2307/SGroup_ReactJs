import { userAPI } from "../../../entities/users/api/userAPI";

interface UserType {
  id: number;
  name: string;
  email: string;
  avatar_url: string | null;
  role: {
    id: number;
    name: "admin" | "staff" | "user";
    description?: string;
  };
}

export async function getInformationUser(
  setDataUser: React.Dispatch<React.SetStateAction<UserType | null>>
) {
  try {
    const res = await userAPI.getInformation();
    const user = res.data.responseObject;

    setDataUser({
      id: user.id,
      name: user.name,
      email: user.email,
      avatar_url: user.avatar_url,
      role: {
        id: user.role?.id,
        name: user.role?.name,
        description: user.role?.description,
      },
    });
  } catch (err) {
    console.error(err);
  }
}
