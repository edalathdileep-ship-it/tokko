import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-base">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center font-grotesk font-bold text-black text-sm">T</div>
            <span className="font-grotesk font-bold text-lg">Tokko</span>
          </div>
          <h1 className="font-grotesk font-bold text-2xl mb-2">Welcome back</h1>
          <p className="text-text-muted text-sm">Sign in to your Tokko account</p>
        </div>
        <SignIn
          routing="hash"
          appearance={{
            elements: {
              rootBox: 'w-full',
              card: 'bg-bg-card border border-border shadow-none rounded-2xl',
              headerTitle: 'hidden',
              headerSubtitle: 'hidden',
              socialButtonsBlockButton: 'bg-bg-surface border border-border text-text hover:bg-bg-s2 transition-colors',
              dividerLine: 'bg-border',
              dividerText: 'text-text-muted',
              formFieldInput: 'bg-bg-surface border-border text-text rounded-lg',
              formFieldLabel: 'text-text-muted',
              formButtonPrimary: 'bg-accent text-black font-bold hover:bg-accent/90 transition-colors',
              footerActionLink: 'text-accent hover:text-accent/80',
            }
          }}
          redirectUrl="/dashboard"
          signUpUrl="/auth/signup"
        />
      </div>
    </div>
  )
}