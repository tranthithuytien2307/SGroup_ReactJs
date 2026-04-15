import { Link } from "react-router-dom";
import { Button } from "../shared/ui/button";
import { PATH } from "../shared/config/PATH";
import { useAuthStore } from "../entities/auth/model/auth.store";

export default function NotFoundPage() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const primaryPath = accessToken ? PATH.DASHBOARD : PATH.LOGIN;
  const primaryLabel = accessToken ? "Back to Dashboard" : "Back to Login";

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_#f8fafc,_#e2e8f0_55%,_#cbd5e1)] px-6">
      <div className="w-full max-w-2xl rounded-[10px] border border-white/70 bg-white/85 p-10 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur">
        <div className="mb-6 inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-1 text-sm font-medium text-slate-600">
          Error 404
        </div>

        <div className="space-y-4">
          <h1 className="text-5xl font-black tracking-tight text-slate-900">
            Page not found
          </h1>
          <p className="max-w-xl text-base leading-7 text-slate-600">
            The page you requested does not exist or the address is incorrect.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild className="bg-black text-white hover:bg-slate-800">
            <Link to={primaryPath}>{primaryLabel}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
