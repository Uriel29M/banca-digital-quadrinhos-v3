import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (request) => {
  if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });
  const rawKeys = Deno.env.get("SUPABASE_SECRET_KEYS") || Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  let secretKey = rawKeys;
  try { secretKey = Object.values(JSON.parse(rawKeys))[0] as string; } catch {}
  const admin = createClient(Deno.env.get("SUPABASE_URL")!, secretKey);
  const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const { data: inactive, error } = await admin.from("profiles").select("id").lt("last_seen_at", cutoff);
  if (error) return Response.json({ error: error.message }, { status: 500 });
  for (const profile of inactive || []) {
    await admin.auth.admin.deleteUser(profile.id);
  }
  return Response.json({ deleted: inactive?.length || 0 });
});
