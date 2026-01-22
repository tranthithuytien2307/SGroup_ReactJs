import { registerApi } from "../api/registerApi";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function useRegister() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      await registerApi.register({ name, email, password });

      navigate("/verify-email", { state: { email } });
    } catch (err: any) {
      alert(err?.response?.data?.message || "Register failed");
    } finally {
      setLoading(false);
    }
  };

  return { register, loading };
}
