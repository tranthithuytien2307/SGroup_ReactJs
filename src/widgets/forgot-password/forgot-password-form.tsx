import React, { useState, useEffect } from "react";
import { useForgotPassword } from "../../features/auth/fotgot-password/model/useForgotPassword";
import { Input } from "../../shared/ui/input";
import { PATH } from "../../shared/config/PATH";
import { useNavigate } from "react-router-dom";

export const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const { hanldeForgotPassword, loading, error } = useForgotPassword();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isSuccess = await hanldeForgotPassword(email);

    if (isSuccess) {
      navigate(`${PATH.RESET_PASSWORD}?email=${encodeURIComponent(email)}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800">Forgot Password</h2>
          <p className="text-sm text-gray-500 mt-2">
            Enter your email and we'll send you an OTP code
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 rounded-lg font-medium transition-all duration-200 
              ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-black hover:bg-gray-800 active:scale-95"
              } text-white`}
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>

        {error && (
          <div className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
            {error}
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
      </div>
    </div>
  );
};
