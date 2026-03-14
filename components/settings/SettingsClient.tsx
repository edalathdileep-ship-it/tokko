'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'

function ApiTokenSection({ userId }: { userId: string }) {
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  async function generateToken() {
    setLoading(true)
    try {
      const res = await fetch('/api/generate-token', { method: 'POST' })
      const json = await res.json()
      if (json.success) setToken(json.token)
    } finally {
      setLoading(false)
    }
  }

  function copyToken() {
    if (!token) return
    navigator.clipboard.writeText(token)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div>
      <p className="font-sans text-[0.82rem] text-text-muted mb-4">
        Generate a token to connect the Tokko Chrome Extension. Paste it in the extension popup.
      </p>
      {token ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <code className="flex-1 font-mono text-[0.75rem] bg-bg-surface border border-border rounded-lg px-3 py-2.5 text-accent truncate">
              {token}
            </code>
            <button
              onClick={copyToken}
              className="font-grotesk font-medium text-[0.82rem] text-accent border border-accent/30 px-3 py-2 rounded-lg hover:bg-accent/10 transition-colors shrink-0"
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
          <p className="font-mono text-[0.65rem] text-accent-red">
            Save this token now — it won't be shown again. Generate a new one if you lose it.
          </p>
        </div>
      ) : (
        <Button onClick={generateToken} loading={loading} size="sm">
          Generate API Token
        </Button>
      )}
    </div>
  )
}

interface Props {
  userId: string
  firstName: string
  lastName: string
  email: string
  imageUrl: string
  createdAt: number
}

function Section({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="border border-border rounded-2xl overflow-hidden mb-4">
      <div className="px-6 py-5 border-b border-border bg-bg-surface/40">
        <div className="font-grotesk font-bold text-[0.94rem]">{title}</div>
        <div className="font-sans text-[0.8rem] text-text-muted mt-0.5">{desc}</div>
      </div>
      <div className="px-6 py-6 bg-bg-card">
        {children}
      </div>
    </div>
  )
}

function Field({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div>
        <div className="font-grotesk font-medium text-[0.84rem]">{label}</div>
        {hint && <div className="font-mono text-[0.65rem] text-text-muted mt-0.5">{hint}</div>}
      </div>
      <div className="font-sans text-[0.84rem] text-text-muted">{value}</div>
    </div>
  )
}

export function SettingsClient({ userId, firstName, lastName, email, imageUrl, createdAt }: Props) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteText, setDeleteText] = useState('')

  const fullName = [firstName, lastName].filter(Boolean).join(' ') || 'Not set'
  const memberSince = new Date(createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const initials = firstName && lastName
    ? `${firstName[0]}${lastName[0]}`
    : firstName ? firstName[0] : email[0]?.toUpperCase() ?? '?'

  return (
    <div>

      {/* ── Profile ── */}
      <Section title="Profile" desc="Your personal information from your account.">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
          <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center font-grotesk font-bold text-black text-[1.1rem] overflow-hidden flex-shrink-0">
            {imageUrl ? (
              <img src={imageUrl} alt="avatar" className="w-14 h-14 object-cover" />
            ) : initials}
          </div>
          <div>
            <div className="font-grotesk font-bold text-[0.94rem]">{fullName}</div>
            <div className="font-mono text-[0.68rem] text-text-muted mt-0.5">{email}</div>
            <div className="font-mono text-[0.62rem] text-text-muted mt-1">Member since {memberSince}</div>
          </div>
        </div>
        <Field label="Full name" value={fullName} />
        <Field label="Email address" value={email} />
        <Field label="User ID" value={userId.slice(0, 20) + '...'} hint="Your unique Tokko ID" />
        <div className="mt-5">
          <a href="https://accounts.clerk.dev/user" target="_blank" rel="noopener noreferrer"
            className="font-grotesk font-medium text-[0.84rem] text-accent hover:underline">
            Edit profile →
          </a>
        </div>
      </Section>

      {/* ── API Token ── */}
      <Section title="Extension API Token" desc="Use this token to connect the Tokko Chrome Extension.">
        <ApiTokenSection userId={userId} />
      </Section>

      {/* ── Plan ── */}
      <Section title="Plan & Billing" desc="Your current plan and usage limits.">
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="font-grotesk font-bold text-[1rem]">Free Plan</span>
              <span className="font-mono text-[0.6rem] font-bold px-2 py-0.5 rounded bg-bg-s2 border border-border text-text-muted">
                CURRENT
              </span>
            </div>
            <div className="font-sans text-[0.82rem] text-text-muted mt-1">
              50 compressions per day · Balanced mode · Claude only
            </div>
          </div>
          <div className="font-grotesk font-bold text-[1.4rem]">$0</div>
        </div>
        <div className="bg-accent/5 border border-accent/20 rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="font-grotesk font-bold text-[0.88rem] text-accent">Upgrade to Pro</div>
            <div className="font-sans text-[0.78rem] text-text-muted mt-0.5">
              Unlimited compressions, all modes, all models
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="font-grotesk font-bold text-[1rem]">$9<span className="text-text-muted font-normal text-[0.78rem]">/mo</span></div>
              <div className="font-mono text-[0.6rem] text-accent">$7/mo annual</div>
            </div>
            <Button size="sm">Upgrade →</Button>
          </div>
        </div>
      </Section>

      {/* ── Preferences ── */}
      <Section title="Preferences" desc="Customize your Tokko experience.">
        <Field label="Default compression mode" value="Balanced" hint="Applied when you open the optimizer" />
        <Field label="Default model" value="Claude Sonnet" hint="Your preferred AI model" />
        <div className="mt-4">
          <p className="font-sans text-[0.8rem] text-text-muted">
            More preferences coming soon — theme, keyboard shortcuts, and notification settings.
          </p>
        </div>
      </Section>

      {/* ── Danger Zone ── */}
      <div className="border border-accent-red/30 rounded-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-accent-red/20 bg-accent-red/5">
          <div className="font-grotesk font-bold text-[0.94rem] text-accent-red">Danger Zone</div>
          <div className="font-sans text-[0.8rem] text-text-muted mt-0.5">Permanent actions that cannot be undone.</div>
        </div>
        <div className="px-6 py-6 bg-bg-card">
          {!showDeleteConfirm ? (
            <div className="flex items-center justify-between">
              <div>
                <div className="font-grotesk font-bold text-[0.88rem]">Delete account</div>
                <div className="font-sans text-[0.78rem] text-text-muted mt-0.5">
                  Permanently delete your account and all compression history.
                </div>
              </div>
              <button onClick={() => setShowDeleteConfirm(true)}
                className="font-grotesk font-medium text-[0.84rem] text-accent-red border border-accent-red/30 px-4 py-2 rounded-lg hover:bg-accent-red/10 transition-colors">
                Delete account
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="font-sans text-[0.84rem] text-text-muted">
                Type <span className="font-mono text-accent-red font-bold">delete my account</span> to confirm.
              </p>
              <input type="text" value={deleteText} onChange={(e) => setDeleteText(e.target.value)}
                placeholder="delete my account"
                className="w-full px-4 py-2.5 bg-bg-surface border border-border rounded-lg font-mono text-[0.84rem] outline-none focus:border-accent-red transition-colors" />
              <div className="flex gap-3">
                <button onClick={() => { setShowDeleteConfirm(false); setDeleteText('') }}
                  className="font-grotesk font-medium text-[0.84rem] text-text-muted border border-border px-4 py-2 rounded-lg hover:bg-bg-surface transition-colors">
                  Cancel
                </button>
                <button disabled={deleteText !== 'delete my account'}
                  className="font-grotesk font-medium text-[0.84rem] text-white bg-accent-red px-4 py-2 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity">
                  Permanently delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}