import tailwindcssAnimate from "tailwindcss-animate";
var config = {
    darkMode: ["class"],
    content: [
        "./components/**/*.{ts,tsx}",
        "./lib/**/*.{ts,tsx}",
        "./hooks/**/*.{ts,tsx}",
        "./**/*.{ts,tsx}",
    ],
    prefix: "",
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            colors: {
                // Orange Group Official Brand Colors
                // Primary: #FF7900 | Black: #000000 | White: #FFFFFF
                orange: {
                    50: '#FFF5EB', // Lightest tint
                    100: '#FFE6CC', // Very light
                    200: '#FFCC99', // Light
                    300: '#FFB366', // Medium light
                    400: '#FF9933', // Medium
                    500: '#FF7900', // Official Orange Group Brand Color
                    600: '#E66D00', // Hover state
                    700: '#CC6100', // Pressed state
                    800: '#994900', // Dark
                    900: '#663000', // Darker
                    950: '#331800', // Darkest
                },
                // Orange Group Semantic Colors
                'brand': {
                    orange: '#FF7900',
                    black: '#000000',
                    white: '#FFFFFF',
                    gray: '#595959',
                },
                // Design system colors
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            fontFamily: {
                sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
                orange: ['Inter', 'Helvetica Neue', 'Arial', 'sans-serif'],
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
                "fade-in": {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                "fade-out": {
                    "0%": { opacity: "1" },
                    "100%": { opacity: "0" },
                },
                "slide-in-from-top": {
                    "0%": { transform: "translateY(-100%)" },
                    "100%": { transform: "translateY(0)" },
                },
                "slide-out-to-top": {
                    "0%": { transform: "translateY(0)" },
                    "100%": { transform: "translateY(-100%)" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                "fade-in": "fade-in 0.2s ease-out",
                "fade-out": "fade-out 0.2s ease-out",
                "slide-in-from-top": "slide-in-from-top 0.2s ease-out",
                "slide-out-to-top": "slide-out-to-top 0.2s ease-out",
            },
        },
    },
    plugins: [tailwindcssAnimate],
};
export default config;
