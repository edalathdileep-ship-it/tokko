// ── Security utilities for Tokko ─────────────────────────

// Max prompt size in characters (~50k tokens worth)
export const MAX_PROMPT_CHARS = 200_000
export const MAX_PROMPT_TOKENS = 50_000

// Strip potentially malicious content from prompt
export function sanitizePrompt(input: string): string {
  return input
    // Remove null bytes
    .replace(/\0/g, '')
    // Remove control characters except newlines and tabs
    .replace(/[\x01-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Normalize excessive whitespace (keep newlines but collapse 4+ blank lines)
    .replace(/\n{4,}/g, '\n\n\n')
    // Trim
    .trim()
}

// Check if prompt is within allowed size
export function isPromptTooLarge(input: string): boolean {
  return input.length > MAX_PROMPT_CHARS
}

// Simple token estimator (1 token ≈ 4 chars)
export function exceedsTokenLimit(input: string): boolean {
  return Math.ceil(input.length / 4) > MAX_PROMPT_TOKENS
}

// Mask sensitive data in error messages before sending to client
export function safeErrorMessage(err: unknown): string {
  const message = err instanceof Error ? err.message : 'An error occurred'

  // Never leak internal details
  const sensitivePatterns = [
    /sk-ant-[a-zA-Z0-9-]+/g,       // Anthropic API keys
    /sk-[a-zA-Z0-9-]+/g,            // OpenAI style keys
    /postgres:\/\/[^\s]+/g,          // DB connection strings
    /supabase\.co[^\s]*/g,           // Supabase URLs with paths
    /at\s+\w+\s+\([^)]+\)/g,        // Stack traces
    /\/home\/[^\s]+/g,               // File paths
    /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, // IP addresses
  ]

  let safe = message
  for (const pattern of sensitivePatterns) {
    safe = safe.replace(pattern, '[redacted]')
  }

  return safe
}

// Rate limit check — returns true if user is within limit
export function isWithinRateLimit(
  compressionsToday: number,
  plan: 'free' | 'pro' | 'teams'
): boolean {
  const limits = { free: 20, pro: Infinity, teams: Infinity }
  return compressionsToday < limits[plan]
}