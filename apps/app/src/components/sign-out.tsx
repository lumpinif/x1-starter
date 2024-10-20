"use client";

import { supabaseBrowserClient } from "@x1-starter/supabase/client";
import { Icons } from "@x1-starter/ui/components/icons";
import { Button } from "@x1-starter/ui/components/ui/button";
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
      className="flex items-center gap-2 font-mono"
    >
      <Icons.SignOut className="size-4" />
      <span>Sign out</span>
    </Button>
  );
}
