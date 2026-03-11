import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          base:    '#0a0a0f',
          surface: '#111118',
          s2:      '#1a1a25',
          card:    '#13131e',
        },
        border: {
          DEFAULT: '#2a2a3a',
        },
        accent: {
          DEFAULT: '#00e5a0',
          hover:   '#00ffb3',
          purple:  '#7b61ff',
          red:     '#ff6b6b',
          orange:  '#ff9f43',
          teal:    '#4ecdc4',
        },
        text: {
          DEFAULT: '#e8e8f0',
          muted:   '#6b6b85',
        },
      },
      fontFamily: {
        grotesk: ['Space Grotesk', 'sans-serif'],
        sans:    ['DM Sans', 'sans-serif'],
        mono:    ['DM Mono', 'monospace'],
      },
      fontSize: {
        'display': ['56px', { lineHeight: '1.0',  letterSpacing: '-0.04em', fontWeight: '700' }],
        'title':   ['34px', { lineHeight: '1.08', letterSpacing: '-0.035em', fontWeight: '700' }],
        'section': ['22px', { lineHeight: '1.2',  letterSpacing: '-0.02em', fontWeight: '700' }],
        'card-title': ['15px', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '700' }],
      },
      spacing: {
        '4.5': '18px',
        '13':  '52px',
        '15':  '60px',
        '18':  '72px',
        '22':  '88px',
        '30':  '120px',
      },
      borderRadius: {
        'xs':  '4px',
        'sm':  '6px',
        'md':  '8px',
        'lg':  '10px',
        'xl':  '12px',
        '2xl': '14px',
        '3xl': '16px',
        '4xl': '20px',
      },
      boxShadow: {
        'card':      '0 4px 20px rgba(0,0,0,0.40)',
        'panel':     '0 20px 60px rgba(0,0,0,0.50)',
        'hero-card': '0 48px 120px rgba(0,0,0,0.70)',
        'btn-glow':  '0 8px 28px rgba(0,229,160,0.30)',
        'compress':  '0 0 30px rgba(0,229,160,0.30), 0 0 60px rgba(0,229,160,0.10)',
      },
      maxWidth: {
        'content': '1160px',
      },
      animation: {
        'pulse-dot': 'pulse-dot 2s ease-in-out infinite',
        'fade-up':   'fade-up 0.8s ease both',
        'float':     'float 10s ease-in-out infinite alternate',
      },
      keyframes: {
        'pulse-dot': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%':      { opacity: '0.4', transform: 'scale(0.8)' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'float': {
          from: { transform: 'translate(0, 0)' },
          to:   { transform: 'translate(24px, 16px)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
