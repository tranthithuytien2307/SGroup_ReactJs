import { Button } from "@/shared/ui/button";
import { CONFIG } from "@/shared/lib/config";

export default function LoginWithGoogle() {
  function getAuthUrl() {
    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    const scopes = [
      "openid",
      "email",
      "profile",
      "https://www.googleapis.com/auth/forms.body",
      "https://www.googleapis.com/auth/forms.responses.readonly",
      "https://www.googleapis.com/auth/drive.file",
    ];

    const options: Record<string, string> = {
      redirect_uri: CONFIG.REDIRECT_URI || "",
      client_id: CONFIG.GOOGLE_CLIENT_ID || "",
      response_type: "code",
      scope: scopes.join(" "),
      prompt: "consent",
    };

    const queryParam = new URLSearchParams(options);
    return `${rootUrl}?${queryParam.toString()}`;
  }

  return (
    <Button
      variant="outline"
      className="w-full cursor-pointer"
      onClick={() => (window.location.href = getAuthUrl())}
    >
      Login with Google
    </Button>
  );
}
