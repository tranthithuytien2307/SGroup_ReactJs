import { useLocation } from "react-router-dom";
import { useState } from "react";
import { Input } from "../../shared/ui/input";
import { Label } from "../../shared/ui/label";
import { Button } from "../../shared/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "../../shared/ui/card";
import { useVerifyEmail } from "../../features/auth/register/model/useVerifyEmail";
import { useResendCode } from "../../features/auth/register/model/useResendCode";

export default function VerifyEmailPage() {
  const location = useLocation();
  const email = location.state?.email;

  const [code, setCode] = useState("");

  const { verify, loading } = useVerifyEmail();
  const { resend, loading: resendLoading } = useResendCode();

  return (
    <Card className="max-w-md mx-auto mt-20">
      <CardHeader>
        <CardTitle>Verify Your Email</CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-gray-600 mb-4">
          We sent a verification code to <b>{email}</b>
        </p>

        <div className="flex flex-col gap-4">
          <div>
            <Label>Verification Code</Label>
            <Input onChange={(e) => setCode(e.target.value)} />
          </div>

          <Button
            disabled={loading}
            className="w-full"
            onClick={() => verify(email, code)}
          >
            {loading ? "Verifying..." : "Verify Email"}
          </Button>

          <Button
            variant="outline"
            disabled={resendLoading}
            className="w-full"
            onClick={() => resend(email)}
          >
            Resend Code
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
