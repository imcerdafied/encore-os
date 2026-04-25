import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;
let _serviceClient: SupabaseClient | null = null;

function getUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL || "";
}

export function getSupabase() {
  if (!_client) {
    const url = getUrl();
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
    if (!url) return null;
    _client = createClient(url, key);
  }
  return _client;
}

export function getServiceClient() {
  if (!_serviceClient) {
    const url = getUrl();
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
    if (!url || !key) return null;
    _serviceClient = createClient(url, key);
  }
  return _serviceClient;
}
