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
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
        card: 'var(--color-card)',
        'card-foreground': 'var(--color-card-foreground)',
        popover: 'var(--color-popover)',
        'popover-foreground': 'var(--color-popover-foreground)',
        primary: 'var(--color-primary)',
        'primary-foreground': 'var(--color-primary-foreground)',
        'primary-hover': 'var(--color-primary-hover)',
        secondary: 'var(--color-secondary)',
        'secondary-foreground': 'var(--color-secondary-foreground)',
        'secondary-hover': 'var(--color-secondary-hover)',
        muted: 'var(--color-muted)',
        'muted-foreground': 'var(--color-muted-foreground)',
        accent: 'var(--color-accent)',
        'accent-foreground': 'var(--color-accent-foreground)',
        destructive: 'var(--color-destructive)',
        'destructive-foreground': 'var(--color-destructive-foreground)',
        border: 'var(--color-border)',
        input: 'var(--color-input)',
        ring: 'var(--color-ring)',

        // 音频特定颜色 - 暖橙主题
        'audio-playing': 'var(--color-audio-playing)',
        'audio-paused': 'var(--color-audio-paused)',
        'audio-loading': 'var(--color-audio-loading)',
        'audio-error': 'var(--color-audio-error)',
        'audio-waveform': 'var(--color-audio-waveform)',
        'audio-progress': 'var(--color-audio-progress)',

        // 状态颜色
        success: 'var(--color-success)',
        'success-foreground': 'var(--color-success-foreground)',
        warning: 'var(--color-warning)',
        'warning-foreground': 'var(--color-warning-foreground)',
        error: 'var(--color-error)',
        'error-foreground': 'var(--color-error-foreground)',
        info: 'var(--color-info)',
        'info-foreground': 'var(--color-info-foreground)',

        // 暖橙琥珀色彩系统 - 完整色阶
        'warm-amber': {
          50: '#fefbf3',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b', // 主色调
          600: '#d97706', // Primary 色
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },

        // 渐进强度系统
        'accent-subtle': 'var(--color-accent-subtle)',
        'accent-moderate': 'var(--color-accent-moderate)',
        'accent-intense': 'var(--color-accent-intense)',
      },
      boxShadow: {
        'glow-sm': '0 0 12px rgba(217, 119, 6, 0.3)',
        'glow-md': '0 0 20px rgba(217, 119, 6, 0.4)',
        'glow-lg': '0 0 32px rgba(217, 119, 6, 0.5)',
        'shadow-glow-sm': '0 0 12px rgba(217, 119, 6, 0.3)',
        'elevation-1': '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
        'elevation-2': '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
        // 暖橙主题阴影系统
        'warm-glow': '0 0 20px rgba(245, 158, 11, 0.4)',
        'warm-glow-sm': '0 0 8px rgba(245, 158, 11, 0.3)',
        'warm-glow-lg': '0 0 32px rgba(245, 158, 11, 0.6)',
        'amber-glow': '0 0 16px rgba(217, 119, 6, 0.5)',
      },
      animation: {
        'audio-pulse': 'audio-pulse 2s ease-in-out infinite',
        'waveform-bounce': 'waveform-bounce 0.8s ease-in-out infinite',
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-up': 'slide-up 0.4s ease-out',
      },
      keyframes: {
        'audio-pulse': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        'waveform-bounce': {
          '0%, 100%': { transform: 'scaleY(1)' },
          '50%': { transform: 'scaleY(1.5)' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/forms')],
}

export default config
