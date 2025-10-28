import { userAPI } from "@/shared/api/userAPI";

interface UserType {
  id: string;
  name: string;
  email: string;
  role: string;
}

export async function getInformationUser(
  setDataUser: React.Dispatch<React.SetStateAction<UserType | null>>
) {
  try {
    const res = await userAPI.getInformation();
    setDataUser(res.data.result);
  } catch (err) {
    console.error(err);
  }
}
