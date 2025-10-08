import { Input } from "../../../shared/ui/input";
import { Label } from "../../../shared/ui/label";
import { Button } from "../../../shared/ui/button";
import { useState } from "react";
import { submit } from "../model/useLoginWithEmail";

export default function LoginWithEmail() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
      <div className="flex flex-col gap-3 mt-5">
        <Button
          type="submit"
          className="w-full"
          onClick={() => submit(email, password)}
        >
          Login
        </Button>
        <Button variant="outline" className="w-full">
          Login with Google
        </Button>
      </div>
    </div>
  );
}
