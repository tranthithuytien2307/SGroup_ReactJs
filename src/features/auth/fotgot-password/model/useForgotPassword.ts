import { useState } from "react";
import { forgotpasswordAPI } from "../api/forgotPasswordAPI";

export const useForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const hanldeForgotPassword = async (email: string) => {
    try {
      setLoading(true);
      setError("");
      await forgotpasswordAPI.forgotpassword(email);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { hanldeForgotPassword, loading, error };
};
