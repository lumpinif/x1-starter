import Link from "next/link";

import {
  signInAction,
  signInWithGithubAction,
  signInWithGoogleAction,
} from "@/actions/auth";
import { FormMessage, Message } from "@/components/auth/form-message";

import { SubmitButton } from "@/components/submit-button";
import { getI18n } from "@/locales/server";
import GithubIcon from "@x1-starter/ui/components/icons/github-icon";
import GoogleIcon from "@x1-starter/ui/components/icons/google-icon";
import { Input } from "@x1-starter/ui/components/ui/input";
import { Label } from "@x1-starter/ui/components/ui/label";

// Main component for the login page
export default async function Login({
  searchParams,
}: {
  searchParams: Message;
}) {
  const t = await getI18n();

  return (
    <div className="mx-auto flex min-w-64 flex-1 flex-col">
      <h1 className="font-medium text-2xl">{t("login.title")}</h1>
      {/* Link to sign-up page for new users */}
      <div className="text flex items-center justify-between text-muted-foreground text-sm">
        <p>{t("login.noAccount")}</p>
        <Link
          className="font-medium text-foreground hover:underline"
          href="/sign-up"
        >
          {t("login.signUp")}
        </Link>
      </div>

      {/* Social login buttons section */}
      <div className="mt-8 flex flex-col gap-2">
        <div className="flex w-full items-center justify-between gap-4">
          <p className="text-muted-foreground text-xs">
            {t("login.socialLogin")}
          </p>
          <Link
            className="group text-muted-foreground text-xs"
            href="/magic-link"
          >
            {t("login.orMagicLink")}
          </Link>
        </div>
        <div className="flex w-full items-center justify-between gap-4">
          <form className="w-full">
            {/* Google login button */}
            <SubmitButton
              variant={"outline"}
              pendingText={t("login.signingIn")}
              formAction={signInWithGoogleAction}
              className="flex w-full items-center justify-center gap-2 shadow-md active:scale-[0.98]"
            >
              <GoogleIcon /> Google
            </SubmitButton>
          </form>
          <form className="w-full">
            {/* GitHub login button */}
            <SubmitButton
              variant={"outline"}
              pendingText={t("login.signingIn")}
              formAction={signInWithGithubAction}
              className="flex w-full items-center justify-center gap-2 shadow-md active:scale-[0.98]"
            >
              <GithubIcon /> GitHub
            </SubmitButton>
          </form>
        </div>
      </div>

      {/* Divider between social login and email/password form */}
      <div className="my-6 flex items-center">
        <hr className="flex-grow border border-t" />
        <span className="mx-4 select-none text-muted-foreground text-sm">
          or
        </span>
        <hr className="flex-grow border border-t" />
      </div>

      {/* Email and password input section */}
      <form className="flex flex-col gap-2 [&>input]:mb-3">
        <Label htmlFor="email">{t("login.email")}</Label>
        <Input
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
        />
        <div className="flex items-center justify-between">
          <Label htmlFor="password">{t("login.password")}</Label>
          {/* Link to forgot password page */}
          <Link
            className="text-muted-foreground text-xs hover:text-foreground hover:underline"
            href="/forgot-password"
          >
            {t("login.forgotPassword")}
          </Link>
        </div>
        <Input
          type="password"
          name="password"
          placeholder="Your password"
          required
        />
        {/* login button with loading state */}
        <SubmitButton
          className="shadow-md"
          pendingText={t("login.signingIn")}
          formAction={signInAction}
        >
          {t("login.signInWithEmail")}
        </SubmitButton>
        {/* Display form messages or errors */}
        <FormMessage message={searchParams} />
      </form>
    </div>
  );
}
