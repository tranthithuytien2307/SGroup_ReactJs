import { Input } from "../../shared/ui/input";
import { Label } from "../../shared/ui/label";
import { Button } from "../../shared/ui/button";
import { useState } from "react";
import { submit } from "../../features/auth/login/model/useLoginWithEmail";
import { useNavigate } from "react-router-dom";

export default function LoginWithEmail() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.MouseEvent) => {
    e.preventDefault();
    await submit(email, password, navigate);
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
        ></Input>
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex justify-between">
          <Label htmlFor="password">Password</Label>
          <a href="#" className="text-sm hover:underline">
            Forgot your password?
          </a>
        </div>
        <Input
          id="password"
          type="password"
          required
          onChange={(e) => setPassword(e.target.value)}
        ></Input>
      </div>
      <div className="mt-5 cursor-pointer">
        <Button type="button" className="w-full bg-black text-white" onClick={handleLogin}>
          Login
        </Button>
      </div>
    </div>
  );
}
