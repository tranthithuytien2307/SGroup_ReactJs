import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../shared/ui/card";
import { Input } from "../../../shared/ui/input";
import { Label } from "../../../shared/ui/label";
import { Button } from "../../../shared/ui/button";
import { useState } from "react";
import LoginWithEmail from "./LoginWithEmail";

export default function LoginForm() {
  const [data, setData] = useState([]);

  return (
    <div className="w-1/3 p-10">
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-5">
              <LoginWithEmail data={setData} />
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="#" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
