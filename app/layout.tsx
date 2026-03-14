import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

export const metadata: Metadata = {
  title: 'Tokko — Stop Wasting Tokens',
  description: 'Compress your AI prompts by up to 75%. Same output, fraction of the cost. Works with Claude, GPT-4, and Gemini.',
  keywords: ['AI', 'prompt compression', 'token optimization', 'Claude', 'GPT-4', 'Gemini'],
  icons: { icon: '/tokko_icon.svg', apple: '/tokko_icon.svg' },
  openGraph: {
    title: 'Tokko — Stop Wasting Tokens',
    description: 'Compress your AI prompts by up to 75%. Same output, fraction of the cost.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" className="scroll-smooth">
        <body className="bg-bg-base text-text-DEFAULT antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}