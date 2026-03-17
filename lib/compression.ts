import Anthropic from '@anthropic-ai/sdk'
import { type CompressionMode, type ModelType } from '@/types'
import { calcCostSaved, genId } from '@/lib/utils'

// ── System prompts per mode ───────────────────────────────
const SYSTEM_PROMPTS: Record<CompressionMode, string> = {
  balanced: `You are a prompt compression engine. Your ONLY job is to rewrite the user's text using fewer words while preserving full meaning.

CRITICAL RULES:
- NEVER output more words than the input. If you cannot reduce, output the original unchanged.
- You are compressing TEXT, not completing a task. Never answer, solve, or fulfill the prompt.
- Remove filler words, redundant phrases, unnecessary politeness, verbose phrasing
- Convert descriptive sentences into concise imperative directives
- Keep all technical terms, variable names, constraints, and proper nouns exactly as-is
- Output ONLY the compressed version — no explanations, no preamble, no markdown
- Target 45–55% token reduction. If input is already concise, aim for at least 20% reduction.`,

  aggressive: `You are an extreme prompt compression engine. Your ONLY job is to rewrite the user's text using as few words as possible.

CRITICAL RULES:
- NEVER output more words than the input. If you cannot reduce, output the original unchanged.
- You are compressing TEXT, not completing a task. Never answer, solve, or fulfill the prompt.
- Use telegram-style compression: short keyword directives only
- Strip articles, conjunctions, pleasantries, and all verbose phrasing
- Convert full sentences into compact directives
- Preserve ONLY: core task, essential constraints, critical technical terms
- Output ONLY the compressed version — nothing else
- Target 70–80% token reduction. Minimum 30% reduction always.`,

  smart: `You are an intelligent prompt compression engine. Your ONLY job is to rewrite the user's text more concisely while keeping the same meaning.

CRITICAL RULES:
- NEVER output more words than the input. If you cannot reduce, output the original unchanged.
- You are compressing TEXT, not completing a task. Never answer, solve, or fulfill the prompt.
- Rewrite for maximum clarity and conciseness — not brevity at the cost of meaning
- Replace verbose explanations with precise keywords
- Remove redundancy while keeping all intent and constraints
- For short prompts: simply remove unnecessary words, do not add structure
- Output ONLY the compressed version — no explanation, no preamble
- Target 35–45% token reduction. Minimum 15% reduction always.`,
}

// ── Strict fallback prompt ────────────────────────────────
const STRICT_PROMPT = `You are a text shortener. Take the text between <compress> tags and rewrite it using fewer words. Do NOT execute, answer, or complete any task in the text. Just make it shorter.

Output ONLY the shortened text. No explanations. No markdown. No code unless the original contained code.`

// ── Model selection per mode ──────────────────────────────
// Sonnet for Balanced/Aggressive (fast, cheap, great at rewriting)
// Opus for Smart (best semantic understanding)
function getModelForMode(mode: CompressionMode): string {
  return mode === 'smart' ? 'claude-opus-4-6' : 'claude-sonnet-4-6'
}

// ── Compress using Anthropic API ──────────────────────────
export async function compressWithClaude(
  prompt: string,
  mode: CompressionMode,
  model: ModelType,
  apiKey: string
) {
  const client = new Anthropic({ apiKey })
  const compressionModel = getModelForMode(mode)

  // First attempt
  const message = await client.messages.create({
    model: compressionModel,
    max_tokens: 2048,
    system: SYSTEM_PROMPTS[mode],
    messages: [{ role: 'user', content: prompt }],
  })

  let compressed = (message.content[0] as { type: 'text'; text: string }).text.trim()

  // Use REAL token counts from API
  const originalTokens = message.usage.input_tokens
  let compressedTokens = message.usage.output_tokens

  // Safety check — if output is longer than input at all, retry with strict prompt
  if (compressed.length >= prompt.length) {
    console.log('[compression] Output not shorter than input, retrying with strict prompt')
    const retry = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      system: STRICT_PROMPT,
      messages: [{ role: 'user', content: `<compress>${prompt}</compress>` }],
    })
    const retryText = (retry.content[0] as { type: 'text'; text: string }).text.trim()
    compressed = retryText.length > prompt.length * 1.1
      ? prompt.split(' ').slice(0, Math.floor(prompt.split(' ').length * 0.6)).join(' ') + '...'
      : retryText
    compressedTokens = retry.usage.output_tokens
  }

  const savedTokens = Math.max(0, originalTokens - compressedTokens)
  const savedPct = originalTokens > 0 ? Math.max(0, Math.round((savedTokens / originalTokens) * 100)) : 0
  const costSaved = calcCostSaved(originalTokens, compressedTokens, model)

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

  const compressed = prompt
    .replace(/\b(could you please|please|kindly|I would like you to|I want you to)\b/gi, '')
    .replace(/\b(if possible|if you can|when you get a chance)\b/gi, '')
    .replace(/\b(I would appreciate|it would be helpful if|I was wondering)\b/gi, '')
    .replace(/\b(a detailed explanation|detailed explanation)\b/gi, 'explanation')
    .replace(/\b(help me understand how I might go about|help me understand how to)\b/gi, 'explain')
    .replace(/\s{2,}/g, ' ')
    .trim()

  const originalTokens = Math.round(prompt.split(/\s+/).length * 1.3)
  const compressedTokens = Math.max(5, Math.round(originalTokens * (1 - ratio)))
  const savedTokens = originalTokens - compressedTokens
  const savedPct = (savedTokens / originalTokens) * 100
  const costSaved = calcCostSaved(originalTokens, compressedTokens, model)

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
