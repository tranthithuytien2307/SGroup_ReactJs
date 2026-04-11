import { userAPI } from "../../../../entities/users/api/userAPI";

export const updateInformationUser = async (
  name: string,
  email: string,
  bio: string,
) => {
  try {
    const res = await userAPI.updateProfile({ name, email, bio });
    return res.data.responseObject;
  } catch (error) {
    console.error("Error updating user information:", error);
    throw error;
  }
};
