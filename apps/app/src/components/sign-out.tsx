"use client";

import { createClient } from "@x1-starter/supabase/client";
import { Button } from "@x1-starter/ui/button";
import { Icons } from "@x1-starter/ui/icons";

export function SignOut() {
  const supabase = createClient();

  const handleSignOut = () => {
    supabase.auth.signOut();
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
