import Anthropic from '@anthropic-ai/sdk'
import { type CompressionMode, type ModelType } from '@/types'
import { estimateTokens, calcCostSaved, genId } from '@/lib/utils'

// ── System prompts per mode ───────────────────────────────
const SYSTEM_PROMPTS: Record<CompressionMode, string> = {
  balanced: `You are a prompt compression engine. Your job is to compress the user's prompt to use fewer tokens while preserving the complete meaning and intent.

Rules:
- Remove filler words, redundant phrases, unnecessary politeness ("could you please", "I would appreciate", "if possible")
- Condense verbose descriptions to their essence
- Keep all technical terms, constraints, and specific requirements exactly as-is
- Keep code snippets verbatim
- Output ONLY the compressed prompt — no explanation, no preamble, no quotes
- Target ~50% token reduction`,

  aggressive: `You are an extreme prompt compression engine. Compress the prompt as aggressively as possible while keeping the core intent intact.

Rules:
- Strip everything non-essential: articles, conjunctions, pleasantries, examples (unless critical)
- Use telegram-style: "Write Python fn filter even nums list" not "Could you write a Python function that filters even numbers from a list"
- Keep proper nouns, technical terms, and critical constraints
- Code snippets: keep only the signature/pattern, drop comments
- Output ONLY the compressed prompt — nothing else
- Target ~75% token reduction`,

  smart: `You are an intelligent prompt compression engine powered by semantic understanding. Compress the prompt while perfectly preserving technical meaning.

Rules:
- Remove only truly redundant content — preserve all semantic information
- Keep technical jargon, domain-specific terms, variable names, and constraints verbatim
- Preserve examples if they clarify edge cases
- Restructure for conciseness without losing nuance
- Maintain any required output format instructions exactly
- Output ONLY the compressed prompt — no explanation
- Target ~40% token reduction with zero semantic loss`,
}

// ── Compress using Anthropic API ──────────────────────────
export async function compressWithClaude(
  prompt: string,
  mode: CompressionMode,
  model: ModelType,
  apiKey: string
) {
  const client = new Anthropic({ apiKey })

  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2048,
    system: SYSTEM_PROMPTS[mode],
    messages: [{ role: 'user', content: prompt }],
  })

  const compressed = (message.content[0] as { type: 'text'; text: string }).text.trim()

  const originalTokens  = estimateTokens(prompt)
  const compressedTokens = estimateTokens(compressed)
  const savedTokens     = originalTokens - compressedTokens
  const savedPct        = originalTokens > 0 ? (savedTokens / originalTokens) * 100 : 0
  const costSaved       = calcCostSaved(originalTokens, compressedTokens, model)

  return {
    id: genId(),
    original: prompt,
    compressed,
    originalTokens,
    compressedTokens,
    savedTokens,
    savedPct,
    costSaved,
    mode,
    model,
    timestamp: new Date().toISOString(),
  }
}

// ── Mock compression for demo (no API key needed) ─────────
export function mockCompress(prompt: string, mode: CompressionMode, model: ModelType) {
  const reductions = { balanced: 0.50, aggressive: 0.74, smart: 0.40 }
  const ratio = reductions[mode]

  // Simple rule-based mock compression
  const compressed = prompt
    .replace(/\b(could you please|please|kindly|I would like you to|I want you to)\b/gi, '')
    .replace(/\b(if possible|if you can|when you get a chance)\b/gi, '')
    .replace(/\b(I would appreciate|it would be helpful if|I was wondering)\b/gi, '')
    .replace(/\b(a detailed explanation|detailed explanation)\b/gi, 'explanation')
    .replace(/\b(help me understand how I might go about|help me understand how to)\b/gi, 'explain')
    .replace(/\s{2,}/g, ' ')
    .trim()

  const originalTokens   = estimateTokens(prompt)
  const compressedTokens = Math.max(5, Math.round(originalTokens * (1 - ratio)))
  const savedTokens      = originalTokens - compressedTokens
  const savedPct         = (savedTokens / originalTokens) * 100
  const costSaved        = calcCostSaved(originalTokens, compressedTokens, model)

  return {
    id: genId(),
    original: prompt,
    compressed: compressed.length < prompt.length * 0.8 ? compressed : compressed.slice(0, Math.floor(compressed.length * 0.6)) + '...',
    originalTokens,
    compressedTokens,
    savedTokens,
    savedPct,
    costSaved,
    mode,
    model,
    timestamp: new Date().toISOString(),
  }
}
