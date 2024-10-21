import { resetPasswordAction } from "@/actions/auth";
import { FormMessage, Message } from "@/components/auth/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@x1-starter/ui/components/ui/input";
import { Label } from "@x1-starter/ui/components/ui/label";

export default async function ResetPassword({
  searchParams,
}: {
  searchParams: Message;
}) {
  return (
    <form className="flex w-full max-w-md flex-col gap-2 p-4 [&>input]:mb-4">
      <h1 className="font-medium text-2xl">Reset password</h1>
      <p className="text-foreground/60 text-sm">
        Please enter your new password below.
      </p>
      <Label htmlFor="password">New password</Label>
      <Input
        type="password"
        name="password"
        placeholder="New password"
        required
      />
      <Label htmlFor="confirmPassword">Confirm password</Label>
      <Input
        type="password"
        name="confirmPassword"
        placeholder="Confirm password"
        required
      />
      <SubmitButton formAction={resetPasswordAction}>
        Reset password
      </SubmitButton>
      <FormMessage message={searchParams} />
    </form>
  );
}
