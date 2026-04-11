import ProfileSidebar from "../widgets/profile/ProfileSidebar";
import ProfileUpdateForm from "../widgets/profile/ProfileUpdateForm";

const EditProfilePage = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <ProfileSidebar />
      <ProfileUpdateForm />
    </div>
  );
};

export default EditProfilePage;
