/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
          elevated: "var(--card-elevated)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        border: {
          DEFAULT: "var(--border)",
          strong: "var(--border-strong)",
        },
        input: {
          DEFAULT: "var(--input)",
          border: "var(--input-border)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
          orange: {
            DEFAULT: "var(--color-orange)",
            text: "var(--color-orange-text)",
            fg: "var(--accent-orange-fg)",
          },
          green: {
            DEFAULT: "var(--color-green)",
            text: "var(--color-green-text)",
            fg: "var(--accent-green-fg)",
          },
          blue: {
            DEFAULT: "var(--color-blue)",
            text: "var(--color-blue-text)",
            fg: "var(--accent-blue-fg)",
          },
          red: {
            DEFAULT: "var(--color-red)",
            text: "var(--color-red-text)",
            fg: "var(--accent-red-fg)",
          },
          purple: {
            DEFAULT: "var(--color-purple)",
            text: "var(--color-purple-text)",
            fg: "var(--accent-purple-fg)",
          },
          cyan: {
            DEFAULT: "var(--color-cyan)",
            text: "var(--color-cyan-text)",
            fg: "var(--accent-cyan-fg)",
          },
          yellow: {
            DEFAULT: "var(--color-yellow)",
            text: "var(--color-yellow-text)",
          },
        },
        brand: {
          yellow: {
            DEFAULT: "var(--brand-yellow)",
            foreground: "var(--brand-yellow-foreground)",
          },
          purple: "var(--brand-purple)",
          orange: "var(--brand-orange)",
          green: "var(--brand-green)",
          blue: "var(--brand-blue)",
          red: "var(--brand-red)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        hero: {
          bg: "var(--hero-bg)",
          fg: "var(--hero-fg)",
          muted: "var(--hero-muted)",
          border: "var(--hero-border)",
        },
        ink: {
          primary: "var(--ink-primary)",
          secondary: "var(--ink-secondary)",
          muted: "var(--ink-muted)",
        },
        subtext: "var(--subtext)",
      },
      fontFamily: {
        display: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      fontSize: {
        '2xs': ['10px', { lineHeight: '14px' }],
      },
      borderRadius: {
        'card': 'var(--radius-card)',
        'btn': 'var(--radius-btn)',
        'pill': 'var(--radius-pill)',
        'chip': 'var(--radius-chip)',
      },
      boxShadow: {
        'brutal-sm': 'var(--shadow-brutal-sm)',
        'brutal': 'var(--shadow-brutal)',
        'brutal-lg': 'var(--shadow-brutal-lg)',
        'brutal-card': 'var(--shadow-card)',
        'brutal-none': 'none',
        'glow-green': '0 0 12px rgba(104, 212, 138, 0.5)',
        'glow-yellow': '0 0 12px rgba(255, 216, 106, 0.5)',
        'glow-blue': '0 0 12px rgba(106, 171, 255, 0.5)',
        'glow-red': '0 0 12px rgba(255, 117, 117, 0.5)',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 8px rgba(104, 212, 138, 0.6)' },
          '50%': { opacity: '0.7', boxShadow: '0 0 16px rgba(104, 212, 138, 0.9)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-left': {
          '0%': { opacity: '0', transform: 'translateX(-8px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'count-up': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'fade-in-up': 'fade-in-up 0.3s ease-out forwards',
        'slide-in-left': 'slide-in-left 0.25s ease-out forwards',
      },
      transitionDuration: {
        'theme': '200ms',
      }
    },
  },
  plugins: [],
}
