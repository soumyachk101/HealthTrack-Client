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
                'soft': '0 4px 20px -2px rgba(45, 212, 191, 0.1)', // Subtle mint shadow
                'glow': '0 0 20px -2px rgba(45, 212, 191, 0.25)', // Stronger mint glow
                // Claymorphism Shadows
                'clay-card': '8px 8px 16px 0px rgba(45, 212, 191, 0.2), -8px -8px 16px 0px rgba(255, 255, 255, 0.8)',
                'clay-btn': '6px 6px 12px 0px rgba(45, 212, 191, 0.3), -6px -6px 12px 0px rgba(255, 255, 255, 0.9)',
                'clay-inner': 'inset 6px 6px 12px 0px rgba(45, 212, 191, 0.2), inset -6px -6px 12px 0px rgba(255, 255, 255, 0.8)',
                'clay-btn-active': 'inset 4px 4px 8px 0px rgba(45, 212, 191, 0.2), inset -4px -4px 8px 0px rgba(255, 255, 255, 0.9)',
            }
        },
    },
    plugins: [],
}
