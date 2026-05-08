/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./lib/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['Inter', 'sans-serif'],
            },
            colors: {
                background: "#ECFEFF",
                foreground: "#1F2937",
                primary: {
                    DEFAULT: "#2DD4BF",
                    foreground: "#ffffff",
                },
                secondary: {
                    DEFAULT: "#60A5FA",
                    foreground: "#ffffff",
                },
                accent: {
                    DEFAULT: "#86EFAC",
                    foreground: "#1F2937",
                },
                muted: {
                    DEFAULT: "#F0FDF4",
                    foreground: "#6B7280",
                },
                card: {
                    DEFAULT: "#ffffff",
                    foreground: "#1F2937",
                },
                border: "#CCFBF1",
                input: "#CCFBF1",
                ring: "#2DD4BF",
                success: {
                    DEFAULT: "#10b981",
                    foreground: "#ffffff",
                },
            },
            borderRadius: {
                'xl': '1rem',
                '2xl': '1.5rem',
                '3xl': '2rem',
            },
            boxShadow: {
                'soft': '0 4px 20px -2px rgba(45, 212, 191, 0.1)',
                'skeuo-sm': '5px 5px 10px #d1d9e6, -5px -5px 10px #ffffff',
                'skeuo-md': '8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff',
                'skeuo-lg': '12px 12px 24px #d1d9e6, -12px -12px 24px #ffffff',
                'skeuo-inset-sm': 'inset 2px 2px 5px #d1d9e6, inset -2px -2px 5px #ffffff',
                'skeuo-inset-md': 'inset 5px 5px 10px #d1d9e6, inset -5px -5px 10px #ffffff',
                'skeuo-convex': '6px 6px 12px #b8c2cc, -6px -6px 12px #ffffff',
                'skeuo-floating': '14px 14px 28px #d1d9e6, -14px -14px 28px #ffffff, 0 4px 20px rgba(45, 212, 191, 0.2)',
            },
            keyframes: {
                'glow-subtle': {
                    '0%, 100%': {
                        boxShadow: '5px 5px 10px #d1d9e6, -5px -5px 10px #ffffff'
                    },
                    '50%': {
                        boxShadow: '5px 5px 10px #d1d9e6, -5px -5px 10px #ffffff, 0 0 20px rgba(45, 212, 191, 0.3)'
                    }
                },
                'blob-float': {
                    '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
                    '33%': { transform: 'translate(30px, -30px) scale(1.1)' },
                    '66%': { transform: 'translate(-20px, 20px) scale(0.9)' }
                }
            },
            animation: {
                'glow-subtle': 'glow-subtle 4s ease-in-out infinite',
                'blob-float': 'blob-float 7s infinite'
            }
        },
    },
    plugins: [],
}
