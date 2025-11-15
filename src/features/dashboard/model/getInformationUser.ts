import { userAPI } from "@/shared/api/userAPI";

interface UserType {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar_url: string | null;
}

export async function getInformationUser(
  setDataUser: React.Dispatch<React.SetStateAction<UserType | null>>
) {
  try {
    const res = await userAPI.getInformation();
    setDataUser(res.data.responseObject);
  } catch (err) {
    console.error(err);
  }
}
