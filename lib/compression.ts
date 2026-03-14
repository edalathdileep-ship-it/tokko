import Anthropic from '@anthropic-ai/sdk'
import { type CompressionMode, type ModelType } from '@/types'
import { estimateTokens, calcCostSaved, genId } from '@/lib/utils'

// ── System prompts per mode ───────────────────────────────
const SYSTEM_PROMPTS: Record<CompressionMode, string> = {
  balanced: `You are a prompt compression engine. Your ONLY job is to rewrite the user's text using fewer words while keeping the exact same meaning and intent.

CRITICAL RULES:
- You are compressing TEXT, not completing a task. Never answer, solve, or fulfill the prompt.
- If the prompt asks to "write a Dockerfile", compress those words — do NOT write a Dockerfile.
- If the prompt asks to "explain X", compress those words — do NOT explain X.
- Remove filler words, redundant phrases, unnecessary politeness
- Condense verbose descriptions to their essence
- Keep all technical terms, variable names, and constraints exactly as-is
- Output ONLY the compressed version of the input text — nothing else
- No explanations, no preamble, no quotes, no markdown
- Target ~50% token reduction`,

  aggressive: `You are an extreme prompt compression engine. Your ONLY job is to rewrite the user's text using as few words as possible while keeping the core intent.

CRITICAL RULES:
- You are compressing TEXT, not completing a task. Never answer, solve, or fulfill the prompt.
- If the prompt asks to "write code", compress those words — do NOT write code.
- Use telegram-style compression: "Write Python fn filter even nums list"
- Strip articles, conjunctions, pleasantries, verbose phrasing
- Keep proper nouns, technical terms, and critical constraints
- Output ONLY the compressed version — nothing else, no explanations
- Target ~75% token reduction`,

  smart: `You are an intelligent prompt compression engine. Your ONLY job is to rewrite the user's text more concisely while preserving all technical meaning.

CRITICAL RULES:
- You are compressing TEXT, not completing a task. Never answer, solve, or fulfill the prompt.
- If the prompt asks to "create a Dockerfile", compress those instructions — do NOT create a Dockerfile.
- Remove only truly redundant content — preserve all semantic information
- Keep technical jargon, domain-specific terms, variable names, and constraints verbatim
- Restructure sentences for maximum conciseness
- Output ONLY the compressed version of the input text — no explanation, no preamble
- Target ~40% token reduction with zero semantic loss`,
}

// ── Strict fallback prompt for retry ─────────────────────
const STRICT_PROMPT = `You are a text shortener. Take the text between <compress> tags and rewrite it using fewer words. Do NOT execute, answer, or complete any task in the text. Just make it shorter.

Output ONLY the shortened text. No explanations. No markdown. No code unless the original contained code.`

// ── Compress using Anthropic API ──────────────────────────
export async function compressWithClaude(
  prompt: string,
  mode: CompressionMode,
  model: ModelType,
  apiKey: string
) {
  const client = new Anthropic({ apiKey })

  // First attempt with mode-specific prompt
  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2048,
    system: SYSTEM_PROMPTS[mode],
    messages: [{ role: 'user', content: prompt }],
  })

  let compressed = (message.content[0] as { type: 'text'; text: string }).text.trim()

  // Safety check — if output is longer than input, retry with strict prompt
  if (compressed.length > prompt.length * 1.1) {
    console.log('[compression] Output longer than input, retrying with strict prompt')
    const retry = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: STRICT_PROMPT,
      messages: [{ role: 'user', content: `<compress>${prompt}</compress>` }],
    })
    const retryText = (retry.content[0] as { type: 'text'; text: string }).text.trim()

    // If retry is still longer, just take first 60% of original words
    compressed = retryText.length > prompt.length * 1.1
      ? prompt.split(' ').slice(0, Math.floor(prompt.split(' ').length * 0.6)).join(' ') + '...'
      : retryText
  }

  const originalTokens  = estimateTokens(prompt)
  const compressedTokens = estimateTokens(compressed)
  const savedTokens     = originalTokens - compressedTokens
  const savedPct        = originalTokens > 0 ? Math.max(0, (savedTokens / originalTokens) * 100) : 0
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