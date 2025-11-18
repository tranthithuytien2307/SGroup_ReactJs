import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Button } from "@/shared/ui/button";
import { useState } from "react";
import { useRegister } from "../model/useRegister";
import { Card, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";

export default function RegisterForm() {
  const { register, loading } = useRegister();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    await register(name, email, password);
  };

  return (
    <Card className="p-10 w-max">
      <CardHeader >
        <CardTitle>Register your account</CardTitle>
        <CardDescription>
          Enter your email below to register your account
        </CardDescription>
      </CardHeader>
      <div className="flex flex-col gap-4 w-96">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Button disabled={loading} onClick={handleSubmit}>
          {loading ? "Registering..." : "Register"}
        </Button>
      </div>
    </Card>
  );
}
