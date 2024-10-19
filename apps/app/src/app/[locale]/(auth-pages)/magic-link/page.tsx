import { sendMagicLinkAction } from "@/actions/auth";
import { FormMessage, Message } from "@/components/auth/form-message";
import { SubmitButton } from "@/components/submit-button";
import { getI18n } from "@/locales/server";
import { Input } from "@x1-starter/ui/components/ui/input";
import { Label } from "@x1-starter/ui/components/ui/label";
import Link from "next/link";

// Main component for the magic link page
export default async function MagicLink({
  searchParams,
}: { searchParams: Message }) {
  const t = await getI18n();

  return (
    <div className="mx-auto flex min-w-64 flex-1 flex-col">
      <h1 className="text-2xl font-medium">{t("magicLink.title")}</h1>

      {/* Magic link form section */}
      <div className="mt-8 w-full">
        <p className="mb-4 text-sm text-muted-foreground">
          {t("magicLink.description")}
        </p>
        <form className="flex flex-col gap-2">
          <Label htmlFor="email">{t("magicLink.email")}</Label>
          <Input
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
          />
          {/* Send magic link button with loading state */}
          <SubmitButton
            className="mt-2 shadow-md"
            pendingText={t("magicLink.sending")}
            formAction={sendMagicLinkAction}
          >
            {t("magicLink.sendButton")}
          </SubmitButton>
          {/* Display form messages or errors */}
          <FormMessage message={searchParams} />
        </form>
      </div>

      {/* Divider */}
      <div className="my-6 flex items-center">
        <hr className="flex-grow border border-t" />
        <span className="mx-4 select-none text-sm text-muted-foreground">
          {t("magicLink.orText")}
        </span>
        <hr className="flex-grow border border-t" />
      </div>

      {/* Links to other login methods */}
      <div className="flex flex-col gap-2">
        {/* Link to regular login page */}
        <p className="text-sm text-muted-foreground">
          {t("magicLink.otherMethods")}
        </p>

        <div className="flex w-full items-center justify-between gap-4">
          <Link
            href="/login"
            className="text-sm text-foreground hover:underline"
          >
            {t("magicLink.passwordSignIn")}
          </Link>
          <Link
            className="text-sm text-foreground hover:underline"
            href="/login"
          >
            {t("magicLink.socialSignIn")}
          </Link>
        </div>
      </div>
    </div>
  );
}
