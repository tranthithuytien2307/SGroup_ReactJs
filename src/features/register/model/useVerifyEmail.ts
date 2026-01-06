import { verifyApi } from "../api/verifyApi";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function useVerifyEmail() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const verify = async (email: string, code: string) => {
    try {
      setLoading(true);
      await verifyApi.verifyEmail(email, code);

      navigate("/login");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Verify failed");
    } finally {
      setLoading(false);
    }
  };

  return { verify, loading };
}
