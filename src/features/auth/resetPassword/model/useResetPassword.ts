import { useState } from "react";
import { resetPasswordApi } from "../api/resetPasswordApi";

export const useResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleResetPassword = async (
    email: string,
    token: string,
    newPassword: string,
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      await resetPasswordApi.resetPassword({
        email,
        token,
        newPassword,
      });

      setSuccess("Password reset successfully");
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || "Reset password failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    handleResetPassword,
    loading,
    error,
    success,
  };
};
