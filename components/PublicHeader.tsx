import { createClient } from "@/lib/supabase/server";
import { PublicHeaderClient } from "./PublicHeaderClient";

export async function PublicHeader() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <PublicHeaderClient isLoggedIn={Boolean(user)} />;
}
