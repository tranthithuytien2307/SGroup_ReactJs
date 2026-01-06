import { useEffect, useState } from "react";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Button } from "@/shared/ui/button";
import { useProfile } from "../model/useProfile";
import { userAPI } from "@/shared/api/userAPI";

export default function ProfileForm() {
  const { updateProfile, uploadAvatar, loading, avatarLoading } = useProfile();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    const load = async () => {
      const res = await userAPI.getInformation();
      const user = res.data.responseObject;
      setName(user.name);
      setEmail(user.email);
      setAvatarUrl(user.avatar_url || "");
    };
    load();
  }, []);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const newUrl = await uploadAvatar(file);
    if (newUrl) setAvatarUrl(newUrl);
  };

  const submitProfile = async () => {
    await updateProfile(name, email);
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white shadow-md rounded-xl p-6">
      <h2 className="text-xl font-bold mb-1">Profile Settings</h2>
      <p className="text-gray-500 mb-6">
        Manage your account settings and profile information
      </p>

      {/* Avatar */}
      <div className="flex items-center gap-4">
        <img
          src={avatarUrl || "/default-avatar.png"}
          className="w-20 h-20 rounded-full border object-cover"
        />

        <div>
          <Label className="cursor-pointer bg-gray-100 p-2 rounded">
            Change Avatar
            <Input
              type="file"
              className="hidden"
              onChange={handleAvatarChange}
              accept="image/*"
            />
          </Label>

          {avatarLoading && (
            <p className="text-sm text-gray-400 mt-1">Uploading...</p>
          )}
        </div>
      </div>

      <div className="mt-6">
        <Label>Full Name</Label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1"
        />
      </div>

      <div className="mt-4">
        <Label>Email</Label>
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1"
        />
      </div>

      <div className="flex gap-3 mt-6">
        <Button onClick={submitProfile} disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>

        <Button variant="secondary" onClick={() => window.location.reload()}>
          Reset
        </Button>
      </div>
    </div>
  );
}
