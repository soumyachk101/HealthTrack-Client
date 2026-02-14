/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['Inter', 'sans-serif'],
            },
            colors: {
                // Mint & Blue Palette - Fresh, Calm, Modern
                background: "#ECFEFF", // Light Mint
                foreground: "#1F2937", // Charcoal

                primary: {
                    DEFAULT: "#2DD4BF", // Mint Green
                    foreground: "#ffffff",
                },

                secondary: {
                    DEFAULT: "#60A5FA", // Soft Blue
                    foreground: "#ffffff",
                },

                accent: {
                    DEFAULT: "#86EFAC", // Pastel Green
                    foreground: "#1F2937",
                },

                muted: {
                    DEFAULT: "#F0FDF4", // Very light mint/white mix
                    foreground: "#6B7280", // Slate 500
                },

                card: {
                    DEFAULT: "#ffffff",
                    foreground: "#1F2937",
                },

                border: "#CCFBF1", // Teal 100 - Subtle mint border
                input: "#CCFBF1",
                ring: "#2DD4BF", // Mint focus ring

                // Kept for backward compatibility if needed, but mapped to new palette
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

                // SKEUOMORPHIC SHADOWS (Light Source: Top Left)
                // Base: #EFF6FF (Light Blue/Grey)

                // Standard Raised Element (Card, Container)
                'skeuo-sm': '5px 5px 10px #d1d9e6, -5px -5px 10px #ffffff',
                'skeuo-md': '8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff',
                'skeuo-lg': '12px 12px 24px #d1d9e6, -12px -12px 24px #ffffff',

                // Pressed/Inset Element (Input, Active Button)
                'skeuo-inset-sm': 'inset 2px 2px 5px #d1d9e6, inset -2px -2px 5px #ffffff',
                'skeuo-inset-md': 'inset 5px 5px 10px #d1d9e6, inset -5px -5px 10px #ffffff',

                // Convex/Concave specific (Buttons)
                'skeuo-convex': '6px 6px 12px #b8c2cc, -6px -6px 12px #ffffff',

                // Floating/Active state
                'skeuo-floating': '14px 14px 28px #d1d9e6, -14px -14px 28px #ffffff, 0 4px 20px rgba(45, 212, 191, 0.2)',
            }
        },
    },
    plugins: [],
}
