import { resendApi } from "../api/resendApi";
import { useState } from "react";

export function useResendCode() {
  const [loading, setLoading] = useState(false);

  const resend = async (email: string) => {
    try {
      setLoading(true);
      await resendApi.resendCode(email);
      alert("Verification code resent!");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Resend failed");
    } finally {
      setLoading(false);
    }
  };

  return { resend, loading };
}
