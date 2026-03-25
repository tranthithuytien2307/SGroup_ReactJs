import { Input } from "../../shared/ui/input";
import { Label } from "../../shared/ui/label";
import { Button } from "../../shared/ui/button";
import { useState } from "react";
import { submit } from "../../features/auth/login/model/useLoginWithEmail";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../shared/config/PATH";

export default function LoginWithEmail() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.MouseEvent) => {
    e.preventDefault();

    setError("");

    const result = await submit(email, password);

    if (!result.success) {
      setError(result.message);
      return;
    }

    navigate(PATH.DASHBOARD);
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-3">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="m@example.com"
          required
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex justify-between">
          <Label htmlFor="password">Password</Label>
          <div
            className="text-sm hover:underline cursor-pointer"
            onClick={() => navigate(PATH.FORGOT_PASSWORD)}
          >
            Forgot your password?
          </div>
        </div>

        <Input
          id="password"
          type="password"
          required
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {error && (
        <div className="text-red-500 text-sm mt-3 bg-red-50 p-2 rounded border border-red-200">
          {error}
        </div>
      )}

      <div className="mt-5">
        <Button
          type="button"
          className="w-full bg-black text-white"
          onClick={handleLogin}
        >
          Login
        </Button>
      </div>
    </div>
  );
}
