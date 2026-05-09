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
                'soft': '0 4px 20px -2px rgba(45, 212, 191, 0.05)',
                'skeuo-sm': '4px 4px 8px rgba(163, 177, 198, 0.3), -4px -4px 8px rgba(255, 255, 255, 0.7)',
                'skeuo-md': '8px 8px 16px rgba(163, 177, 198, 0.4), -8px -8px 16px rgba(255, 255, 255, 0.8)',
                'skeuo-lg': '12px 12px 24px rgba(163, 177, 198, 0.4), -12px -12px 24px rgba(255, 255, 255, 0.8)',
                'skeuo-inset-sm': 'inset 2px 2px 5px rgba(163, 177, 198, 0.3), inset -2px -2px 5px rgba(255, 255, 255, 0.7)',
                'skeuo-inset-md': 'inset 5px 5px 10px rgba(163, 177, 198, 0.4), inset -5px -5px 10px rgba(255, 255, 255, 0.8)',
                'skeuo-convex': '6px 6px 12px rgba(163, 177, 198, 0.4), -6px -6px 12px rgba(255, 255, 255, 0.8)',
                'skeuo-floating': '20px 20px 40px rgba(163, 177, 198, 0.3), -20px -20px 40px rgba(255, 255, 255, 0.7), 0 4px 20px rgba(45, 212, 191, 0.1)',
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
