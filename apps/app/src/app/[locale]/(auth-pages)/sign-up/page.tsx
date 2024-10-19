import { signUpAction } from "@/actions/auth";
import { FormMessage, Message } from "@/components/auth/form-message";
import { SubmitButton } from "@/components/submit-button";
import { getI18n } from "@/locales/server";
import { Input } from "@x1-starter/ui/components/ui/input";
import { Label } from "@x1-starter/ui/components/ui/label";
import Link from "next/link";

export default async function Signup({
  searchParams,
}: { searchParams: Message }) {
  const t = await getI18n();

  if ("message" in searchParams) {
    return (
      <div className="flex h-screen w-full flex-1 items-center justify-center gap-2 p-4 sm:max-w-md">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <>
      <form className="mx-auto flex min-w-64 flex-1 flex-col">
        <h1 className="text-2xl font-medium">{t("signup.title")}</h1>
        <div className="text flex items-center justify-between text-sm text-muted-foreground">
          <p>{t("signup.haveAccount")}</p>
          <Link
            className="font-medium text-foreground hover:underline"
            href="/login"
          >
            {t("signup.loginHere")}
          </Link>
        </div>
        <div className="mt-8 flex flex-col gap-2 [&>input]:mb-3">
          <Label htmlFor="email">{t("signup.email")}</Label>
          <Input
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
          />
          <Label htmlFor="password">{t("signup.password")}</Label>
          <Input
            type="password"
            name="password"
            placeholder="Your password"
            minLength={6}
            required
          />
          <SubmitButton
            formAction={signUpAction}
            pendingText={t("signup.signingUp")}
          >
            {t("signup.signupButton")}
          </SubmitButton>
          <FormMessage message={searchParams} />
        </div>
      </form>
    </>
  );
}
