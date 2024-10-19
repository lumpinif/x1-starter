import { logger } from "@x1-starter/logger";
import { supabaseServerClient } from "@x1-starter/supabase/server";

export async function getUser() {
  const supabase = supabaseServerClient();

  try {
    const result = await supabase.auth.getUser();

    return result;
  } catch (error) {
    logger.error(error);

    throw error;
  }
}
