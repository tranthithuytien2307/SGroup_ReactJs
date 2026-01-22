import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { exchangeCode } from "../../features/auth/login/model/useLoginWithGoogle";

export default function GoogleCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) return;

    exchangeCode(code, navigate);
  }, [searchParams, navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Đang xác thực Google...</h2>
      <p>Vui lòng chờ trong giây lát.</p>
    </div>
  );
}
