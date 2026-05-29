tailwind.config = {
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
                display: ['Plus Jakarta Sans', 'sans-serif'],
            },
            colors: {
                stone: {
                    50: '#fafaf9',
                    100: '#f5f5f4',
                    200: '#e7e5e4',
                    300: '#d6d3d1',
                    400: '#a8a29e',
                    500: '#78716c',
                    600: '#57534e',
                    700: '#44403c',
                    800: '#292524',
                    900: '#1c1917',
                },
                'brand-yellow': {
                    DEFAULT: '#EDC54C',
                    muted1: '#eedb99',
                    muted2: '#f7edd2',
                    dark: '#be9e3d',
                },
            },
            animation: {
                'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
            },
            keyframes: {
                pulseGlow: {
                    '0%, 100%': { opacity: 0.2, filter: 'blur(40px)' },
                    '50%': { opacity: 0.6, filter: 'blur(60px)' }
                }
            }
        }
    }
}
