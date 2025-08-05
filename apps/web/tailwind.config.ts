import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      container: {
        center: true,
        padding: '2rem',
        screens: {
          '2xl': '1400px',
        },
      },
      colors: {
        neutral: {
          50: 'var(--color-neutral-50)',
          100: 'var(--color-neutral-100)',
          200: 'var(--color-neutral-200)',
          300: 'var(--color-neutral-300)',
          400: 'var(--color-neutral-400)',
          500: 'var(--color-neutral-500)',
          600: 'var(--color-neutral-600)',
          700: 'var(--color-neutral-700)',
          800: 'var(--color-neutral-800)',
          900: 'var(--color-neutral-900)',
        },

        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
        card: 'var(--color-card)',
        'card-foreground': 'var(--color-card-foreground)',
        popover: 'var(--color-popover)',
        'popover-foreground': 'var(--color-popover-foreground)',

        primary: 'var(--color-primary)',
        'primary-foreground': 'var(--color-primary-foreground)',
        'primary-hover': 'var(--color-primary-hover)',
        'primary-active': 'var(--color-primary-active)',

        secondary: 'var(--color-secondary)',
        'secondary-foreground': 'var(--color-secondary-foreground)',
        'secondary-hover': 'var(--color-secondary-hover)',

        success: 'var(--color-success)',
        'success-foreground': 'var(--color-success-foreground)',
        'success-subtle': 'var(--color-success-subtle)',

        warning: 'var(--color-warning)',
        'warning-foreground': 'var(--color-warning-foreground)',
        'warning-subtle': 'var(--color-warning-subtle)',

        error: 'var(--color-error)',
        'error-foreground': 'var(--color-error-foreground)',
        'error-subtle': 'var(--color-error-subtle)',

        info: 'var(--color-info)',
        'info-foreground': 'var(--color-info-foreground)',
        'info-subtle': 'var(--color-info-subtle)',

        audio: {
          playing: 'var(--color-audio-playing)',
          paused: 'var(--color-audio-paused)',
          loading: 'var(--color-audio-loading)',
          processing: 'var(--color-audio-processing)',
          error: 'var(--color-audio-error)',
          waveform: 'var(--color-audio-waveform)',
          progress: 'var(--color-audio-progress)',
        },

        muted: 'var(--color-muted)',
        'muted-foreground': 'var(--color-muted-foreground)',
        accent: 'var(--color-accent)',
        'accent-foreground': 'var(--color-accent-foreground)',
        border: 'var(--color-border)',
        input: 'var(--color-input)',
        ring: 'var(--color-ring)',

        sidebar: 'var(--color-sidebar)',
        'sidebar-foreground': 'var(--color-sidebar-foreground)',
        'sidebar-border': 'var(--color-sidebar-border)',
        'sidebar-accent': 'var(--color-sidebar-accent)',
        'sidebar-accent-foreground': 'var(--color-sidebar-accent-foreground)',

        destructive: 'var(--color-destructive)',
        'destructive-foreground': 'var(--color-destructive-foreground)',
      },

      boxShadow: {
        'soft-xs': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'soft-sm':
          '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'soft-md':
          '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'soft-lg':
          '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'soft-xl':
          '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',

        'focus-ring': '0 0 0 2px var(--color-ring)',
        'focus-ring-offset':
          '0 0 0 2px var(--color-background), 0 0 0 4px var(--color-ring)',

        'brand-glow-sm': '0 0 8px oklch(45.8% 0.085 235 / 0.15)',
        'brand-glow-md': '0 0 16px oklch(45.8% 0.085 235 / 0.2)',

        'audio-glow': '0 0 12px var(--color-audio-waveform)',
        'audio-active': '0 2px 8px oklch(62.5% 0.095 145 / 0.3)',

        'card-hover': '0 8px 25px -8px rgb(0 0 0 / 0.15)',
        'card-active': '0 2px 8px -2px rgb(0 0 0 / 0.1)',
      },

      spacing: {
        '18': '4.5rem', // 72px
        '22': '5.5rem', // 88px
        '26': '6.5rem', // 104px
        '30': '7.5rem', // 120px
        '34': '8.5rem', // 136px
      },

      borderRadius: {
        xs: 'var(--radius-sm)',
        sm: 'var(--radius-sm)',
        DEFAULT: 'var(--radius)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },

      animation: {
        'fade-in': 'fade-in var(--duration-normal) var(--ease-out)',
        'slide-up': 'slide-up var(--duration-normal) var(--ease-out)',
        'slide-down': 'slide-down var(--duration-normal) var(--ease-out)',
        'scale-in': 'scale-in var(--duration-normal) var(--ease-out)',

        'audio-pulse': 'audio-pulse 2.5s var(--ease-in-out) infinite',
        'waveform-dance': 'waveform-dance 1.2s var(--ease-in-out) infinite',
        'progress-fill': 'progress-fill var(--duration-slow) var(--ease-out)',

        spin: 'spinner 1s linear infinite',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        skeleton: 'skeleton-loading 1.5s infinite',

        'button-press': 'button-press var(--duration-fast) var(--ease-out)',
        bounce: 'gentle-bounce var(--duration-slower) var(--ease-out)',
        'focus-ring': 'focus-ring 0.6s var(--ease-out)',
      },

      transitionTimingFunction: {
        'ease-out': 'var(--ease-out)',
        'ease-in': 'var(--ease-in)',
        'ease-in-out': 'var(--ease-in-out)',
        bounce: 'var(--ease-bounce)',
      },

      transitionDuration: {
        fast: 'var(--duration-fast)',
        normal: 'var(--duration-normal)',
        slow: 'var(--duration-slow)',
        slower: 'var(--duration-slower)',
      },

      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: [
          'ui-monospace',
          'SF Mono',
          'Monaco',
          'Cascadia Code',
          'Roboto Mono',
          'Courier New',
          'monospace',
        ],
      },

      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/forms')],
}

export default config
