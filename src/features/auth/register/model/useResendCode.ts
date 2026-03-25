import { resendApi } from "../api/resendApi";
import React, { useState } from "react";

export function useResendCode() {
  const [loading, setLoading] = useState(false);

  const resend = async (
    email: string,
    setNotice: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {
    try {
      setLoading(true);
      await resendApi.resendCode(email);
      setNotice(true);
    } catch (err: any) {
      alert(err?.response?.data?.message || "Resend failed");
    } finally {
      setLoading(false);
    }
  };

  return { resend, loading };
}
