import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// DECISION: No proxy config here — the client hits the API via the full URL
// from VITE_API_URL. This keeps client and server fully decoupled, which
// matches the deployment model (Vercel + Render on separate domains).
export default defineConfig({
  plugins: [react()],
});
