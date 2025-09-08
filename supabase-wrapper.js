// supabase-wrapper.js
// Tiny wrapper that re-exports createClient from the official Supabase ESM CDN.
// This avoids bundling the whole library into your repo and resolves import paths correctly.
export { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.57.2/+esm";
