const LAWGLITCH_CONFIG = {
  SUPABASE_URL: "https://pxwbumtpnzbbqzqhnsow.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  EDGE_FUNCTION_URL: "https://pxwbumtpnzbbqzqhnsow.supabase.co/functions/v1/admin-data",
  RATE_LIMIT: {
    MAX_SUBMISSIONS: 3,
    WINDOW_MS: 15 * 60 * 1000,
  },
};
Object.freeze(LAWGLITCH_CONFIG);
Object.freeze(LAWGLITCH_CONFIG.RATE_LIMIT);
