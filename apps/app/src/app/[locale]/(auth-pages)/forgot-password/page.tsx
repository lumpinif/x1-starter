import { forgotPasswordAction } from "@/actions/auth";
import { FormMessage, Message } from "@/components/auth/form-message";
import { SubmitButton } from "@/components/submit-button";
import { getI18n } from "@/locales/server";
import { Input } from "@x1-starter/ui/components/ui/input";
import { Label } from "@x1-starter/ui/components/ui/label";
import Link from "next/link";

export default async function ForgotPassword({
  searchParams,
}: {
  searchParams: Message;
}) {
  const t = await getI18n();

  return (
    <>
      <form className="mx-auto flex min-w-64 flex-1 flex-col gap-2 text-foreground [&>input]:mb-6">
        <div>
          <h1 className="text-2xl font-medium">{t("forgotPassword.title")}</h1>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>{t("forgotPassword.haveAccount")}</p>
            <Link className="text-foreground hover:underline" href="/login">
              {t("forgotPassword.signInHere")}
            </Link>
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-2 [&>input]:mb-3">
          <Label htmlFor="email">{t("forgotPassword.email")}</Label>
          <Input
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
          />
          <SubmitButton formAction={forgotPasswordAction}>
            {t("forgotPassword.resetButton")}
          </SubmitButton>
          <FormMessage message={searchParams} />
        </div>
      </form>
    </>
  );
}
