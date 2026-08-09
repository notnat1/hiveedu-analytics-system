/**
 * Centralized API base URL — reads from NEXT_PUBLIC_API_URL env var.
 * Set this in .env.local for development and .env.production for production.
 */
export const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";
