import { useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Input } from "../../shared/ui/input";
import { useResetPassword } from "../../features/auth/resetPassword/model/useResetPassword";
import { PATH } from "../../shared/config/PATH";

export const ResetPasswordForm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const email = searchParams.get("email") || "";

  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [tokenError, setTokenError] = useState("");

  const { handleResetPassword, loading, error, success } = useResetPassword();

  const validateToken = (value: string) => {
    if (value.length !== 6) {
      return "Invalid token";
    }
    return "";
  };

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      return "Password must be at least 6 characters";
    }
    if (!/[A-Za-z]/.test(password)) {
      return "Password must contain at least 1 letter";
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least 1 number";
    }
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const tokenErr = validateToken(token);
    const passErr = validatePassword(newPassword);

    setTokenError(tokenErr);
    setPasswordError(passErr);

    if (tokenErr || passErr) return;

    const isSuccess = await handleResetPassword(email, token, newPassword);

    if (isSuccess) {
      setTimeout(() => {
        navigate(PATH.LOGIN);
      }, 1500);
    }
  };

  const isFormValid =
    token &&
    newPassword &&
    !validateToken(token) &&
    !validatePassword(newPassword);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 transition-all">
        <h2 className="text-2xl font-bold text-center mb-2">Reset Password</h2>

        <p className="text-sm text-gray-500 mb-6 text-center">
          Resetting password for <b>{email}</b>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="Enter 6-digit OTP"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              maxLength={6}
              required
            />
            {tokenError && (
              <p className="text-red-500 text-sm mt-1">{tokenError}</p>
            )}
          </div>

          <div>
            <Input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            {passwordError && (
              <p className="text-red-500 text-sm mt-1">{passwordError}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !isFormValid}
            className={`w-full py-2.5 rounded-lg font-medium transition-all duration-200
              ${
                loading || !isFormValid
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-black hover:bg-gray-800 active:scale-95"
              }
              text-white shadow-md`}
          >
            {loading ? "Processing..." : "Reset Password"}
          </button>
        </form>

        {success && (
          <div className="mt-4 text-green-600 text-sm bg-green-50 p-3 rounded border border-green-200 text-center">
            {success}
          </div>
        )}

        {error && (
          <div className="mt-4 text-red-600 text-sm bg-red-50 p-3 rounded border border-red-200 text-center">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};
