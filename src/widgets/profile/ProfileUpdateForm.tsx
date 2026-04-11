import { useEffect, useState } from "react";
import { useAuthStore } from "../../entities/auth/model/auth.store";
import { useUserStore } from "../../features/auth/informationUser/model/userStore";
import { useProfile } from "../../features/profile/model/useProfile";
import toast from "react-hot-toast";

const ProfileUpdateForm = () => {
  const { user, fetchUser } = useAuthStore();
  const { updateUser, loading } = useUserStore();
  const { uploadAvatar, avatarLoading } = useProfile();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    if (!user) fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setUsername(user.email || "");
      setBio(user.bio || "");
      setAvatarUrl(user.avatar_url || "");
    }
  }, [user]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const newUrl = await uploadAvatar(file);

      if (newUrl) {
        setAvatarUrl(newUrl);

        const currentUser = useAuthStore.getState().user;
        if (currentUser) {
          const newUser = { ...currentUser, avatar_url: newUrl };
          localStorage.setItem("user", JSON.stringify(newUser));
          useAuthStore.setState({ user: newUser });
        }

        toast.success("Cập nhật ảnh thành công");
      }
    } catch (err) {
      toast.error("Upload ảnh thất bại");
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Tên không được để trống");
      return;
    }

    const promise = updateUser(name, username, bio);

    toast.promise(promise, {
      loading: "Đang cập nhật...",
      success: "Cập nhật thành công",
      error: "Cập nhật thất bại",
    });

    await promise;
  };

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-semibold">Hồ sơ</h1>

        {/* Avatar */}
        <div className="flex items-center gap-6">
          <img
            src={avatarUrl || "/default-avatar.png"}
            className="w-20 h-20 rounded-full object-cover border"
          />

          <label className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer">
            Thay đổi ảnh
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleAvatarChange}
            />
          </label>

          {avatarLoading && (
            <span className="text-sm text-gray-400">Đang upload...</span>
          )}
        </div>

        <InputField
          label="Tên hiển thị"
          value={name}
          onChange={(e: any) => setName(e.target.value)}
        />

        <InputField
          label="Email / Username"
          value={username}
          onChange={(e: any) => setUsername(e.target.value)}
        />

        <TextAreaField
          label="Giới thiệu"
          value={bio}
          onChange={(e: any) => setBio(e.target.value)}
        />

        <button
          onClick={handleSave}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </div>
    </div>
  );
};

const InputField = ({ label, value, onChange }: any) => (
  <div>
    <label className="block text-sm text-gray-600 mb-1">{label}</label>
    <input
      value={value}
      onChange={onChange}
      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

const TextAreaField = ({ label, value, onChange }: any) => (
  <div>
    <label className="block text-sm text-gray-600 mb-1">{label}</label>
    <textarea
      value={value}
      onChange={onChange}
      rows={4}
      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

export default ProfileUpdateForm;
