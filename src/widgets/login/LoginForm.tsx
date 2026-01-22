import { PATH } from "../../shared/config/PATH";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../shared/ui/card";
import LoginWithEmail from "./LoginWithEmail";
import LoginWithGoogle from "./LoginWithGoogle";

export default function LoginForm() {
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
              <LoginWithEmail />
              <LoginWithGoogle />
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href={PATH.REGISTER} className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
