/**
 * LawGlitch Configuration
 * ========================
 */
const LAWGLITCH_CONFIG = {
  // Your Supabase project URL
  SUPABASE_URL: "https://pxwbumtpnzbbqzqhnsow.supabase.co",

  // Your Supabase anon/public key
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4d2J1bXRwbnpiYnF6cWhuc293Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyNjM4NTcsImV4cCI6MjA3MzgzOTg1N30.CfDyCEQCCoc4p1KrE_G43ToVGExuVvGAGWk3hMQxf3s",

  // Edge function URL for admin operations
  EDGE_FUNCTION_URL: "https://pxwbumtpnzbbqzqhnsow.supabase.co/functions/v1/admin-data",

  // Note: Admin password is verified server-side via Edge Function
  // The password is stored as a Supabase secret: ADMIN_PASSWORD
  // Set it in your Supabase dashboard: Project Settings > Edge Functions > Secrets

  // Rate limiting settings (client-side throttle)
  RATE_LIMIT: {
    // Maximum form submissions per IP per window
    MAX_SUBMISSIONS: 3,
    // Time window in milliseconds (15 minutes)
    WINDOW_MS: 15 * 60 * 1000,
  },
};

// Freeze to prevent tampering
Object.freeze(LAWGLITCH_CONFIG);
Object.freeze(LAWGLITCH_CONFIG.RATE_LIMIT);
