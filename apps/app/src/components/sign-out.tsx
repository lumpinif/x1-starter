"use client";

import { supabaseBrowserClient } from "@x1-starter/supabase/client";
import { Button } from "@x1-starter/ui/components/ui/button";
import { Icons } from "@x1-starter/ui/icons";
import { useRouter } from "next/navigation";

export function SignOut() {
  const supabase = supabaseBrowserClient();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <Button
      onClick={handleSignOut}
      variant="outline"
      className="font-mono gap-2 flex items-center"
    >
      <Icons.SignOut className="size-4" />
      <span>Sign out</span>
    </Button>
  );
}
