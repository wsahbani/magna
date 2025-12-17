declare const config: {
    darkMode: string[];
    content: string[];
    prefix: string;
    theme: {
        container: {
            center: boolean;
            padding: string;
            screens: {
                "2xl": string;
            };
        };
        extend: {
            colors: {
                orange: {
                    50: string;
                    100: string;
                    200: string;
                    300: string;
                    400: string;
                    500: string;
                    600: string;
                    700: string;
                    800: string;
                    900: string;
                    950: string;
                };
                brand: {
                    orange: string;
                    black: string;
                    white: string;
                    gray: string;
                };
                border: string;
                input: string;
                ring: string;
                background: string;
                foreground: string;
                primary: {
                    DEFAULT: string;
                    foreground: string;
                };
                secondary: {
                    DEFAULT: string;
                    foreground: string;
                };
                destructive: {
                    DEFAULT: string;
                    foreground: string;
                };
                muted: {
                    DEFAULT: string;
                    foreground: string;
                };
                accent: {
                    DEFAULT: string;
                    foreground: string;
                };
                popover: {
                    DEFAULT: string;
                    foreground: string;
                };
                card: {
                    DEFAULT: string;
                    foreground: string;
                };
            };
            borderRadius: {
                lg: string;
                md: string;
                sm: string;
            };
            fontFamily: {
                sans: string[];
                orange: string[];
            };
            keyframes: {
                "accordion-down": {
                    from: {
                        height: string;
                    };
                    to: {
                        height: string;
                    };
                };
                "accordion-up": {
                    from: {
                        height: string;
                    };
                    to: {
                        height: string;
                    };
                };
                "fade-in": {
                    "0%": {
                        opacity: string;
                    };
                    "100%": {
                        opacity: string;
                    };
                };
                "fade-out": {
                    "0%": {
                        opacity: string;
                    };
                    "100%": {
                        opacity: string;
                    };
                };
                "slide-in-from-top": {
                    "0%": {
                        transform: string;
                    };
                    "100%": {
                        transform: string;
                    };
                };
                "slide-out-to-top": {
                    "0%": {
                        transform: string;
                    };
                    "100%": {
                        transform: string;
                    };
                };
            };
            animation: {
                "accordion-down": string;
                "accordion-up": string;
                "fade-in": string;
                "fade-out": string;
                "slide-in-from-top": string;
                "slide-out-to-top": string;
            };
        };
    };
    plugins: {
        handler: () => void;
    }[];
};
export default config;
//# sourceMappingURL=tailwind.config.d.ts.map