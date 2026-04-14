import { resendApi } from "../api/resendApi";
import React, { useState } from "react";

export function useResendCode() {
  const [loading, setLoading] = useState(false);

  const resend = async (
    email: string,
    setNotice: React.Dispatch<React.SetStateAction<boolean>>,
    setVerificationCode: React.Dispatch<React.SetStateAction<string | null>>,
    setEmailSent: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {
    try {
      setLoading(true);
      const res = await resendApi.resendCode(email);
      setVerificationCode(res.data.responseObject?.verificationCode ?? null);
      setEmailSent(res.data.responseObject?.emailSent ?? true);
      setNotice(true);
    } catch (err: any) {
      alert(err?.response?.data?.message || "Resend failed");
    } finally {
      setLoading(false);
    }
  };

  return { resend, loading };
}
