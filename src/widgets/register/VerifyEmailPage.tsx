import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Input } from "../../shared/ui/input";
import { Label } from "../../shared/ui/label";
import { Button } from "../../shared/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "../../shared/ui/card";
import { useVerifyEmail } from "../../features/auth/register/model/useVerifyEmail";
import { useResendCode } from "../../features/auth/register/model/useResendCode";
import { PATH } from "../../shared/config/PATH";

export default function VerifyEmailPage() {
  const location = useLocation();
  const email = location.state?.email;
  const navigate = useNavigate();

  if (!email) {
    return (
      <div className="text-center mt-20 text-gray-600">Email not found</div>
    );
  }

  const [code, setCode] = useState("");
  const [notice, setNotice] = useState(false);

  const { verify, loading } = useVerifyEmail();
  const { resend, loading: resendLoading } = useResendCode();

  return (
    <Card className="max-w-md mx-auto mt-20">
      <CardHeader>
        <CardTitle>Verify Your Email</CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-gray-600 mb-3">
          We sent a verification code to <b>{email}</b>
        </p>

        <div className="flex flex-col gap-4">
          <div>
            <Label>Verification Code</Label>
            <Input className="mt-3" onChange={(e) => setCode(e.target.value)} />
          </div>

          <Button
            disabled={loading}
            className="w-full bg-black text-white"
            onClick={() => verify(email, code)}
          >
            {loading ? "Verifying..." : "Verify Email"}
          </Button>

          <Button
            variant="outline"
            disabled={resendLoading}
            className="w-full"
            onClick={() => resend(email, setNotice)}
          >
            Resend Code
          </Button>
        </div>
        {notice && (
          <div className="mt-3 mb-3 text-center text-green-600 text-sm">
            Đã gửi lại mã, vui lòng kiểm tra email:
            <div className="font-semibold">{email}</div>
          </div>
        )}
        <div className="mt-6 text-center">
          <div
            className="text-sm text-gray-800 hover:underline cursor-pointer"
            onClick={() => navigate(PATH.LOGIN)}
          >
            Back to Login
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
