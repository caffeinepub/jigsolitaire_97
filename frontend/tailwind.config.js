/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["index.html", "src/**/*.{js,ts,jsx,tsx,html,css}"],
  theme: {
    extend: {
      colors: {
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        landing: "var(--landing)",
        "landing-glow": "var(--landing-glow)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        sidebar: {
          DEFAULT: "var(--sidebar)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
        chart: {
          1: "var(--chart-1)",
          2: "var(--chart-2)",
          3: "var(--chart-3)",
          4: "var(--chart-4)",
          5: "var(--chart-5)",
        },
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        sans: ["var(--font-sans)"],
        serif: ["var(--font-serif)"],
        mono: ["var(--font-mono)"],
      },
      borderColor: {
        DEFAULT: "var(--border)",
      },
      boxShadow: {
        "2xs": "var(--shadow-2xs)",
        xs: "var(--shadow-xs)",
        sm: "var(--shadow-sm)",
        DEFAULT: "var(--shadow)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
        "2xl": "var(--shadow-2xl)",
      },
      letterSpacing: {
        normal: "var(--tracking-normal)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "title-bounce": {
          "0%": { opacity: "0", transform: "translateY(28px) scale(0.95)" },
          "60%": { opacity: "1", transform: "translateY(-3px) scale(1.01)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        float: {
          "0%, 100%": {
            transform: "translateY(0) rotate(var(--float-rotate, 0deg))",
          },
          "50%": {
            transform: "translateY(-14px) rotate(var(--float-rotate, 0deg))",
          },
        },
        "tile-pop": {
          "0%": { opacity: "0", transform: "scale(0.3)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "tile-swap": {
          "0%": { transform: "scale(1)" },
          "40%": { transform: "scale(0.88)" },
          "100%": { transform: "scale(1)" },
        },
        "tile-lock": {
          "0%": {
            transform: "scale(1)",
            boxShadow: "0 0 0 0 rgba(34,197,94,0)",
          },
          "30%": {
            transform: "scale(1.1)",
            boxShadow: "0 0 12px 2px rgba(34,197,94,0.4)",
          },
          "60%": { transform: "scale(0.95)" },
          "100%": {
            transform: "scale(1)",
            boxShadow: "0 0 0 0 rgba(34,197,94,0)",
          },
        },
        "completion-glow": {
          "0%": { opacity: "0", transform: "scale(0.6)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "star-pop": {
          "0%": { opacity: "0", transform: "scale(0) rotate(-20deg)" },
          "60%": { opacity: "1", transform: "scale(1.3) rotate(5deg)" },
          "100%": { opacity: "1", transform: "scale(1) rotate(0deg)" },
        },
        "overlay-in": {
          "0%": { opacity: "0", transform: "translateY(24px) scale(0.96)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "tile-shake": {
          "0%, 100%": { transform: "translateX(0)" },
          "20%": { transform: "translateX(-3px)" },
          "40%": { transform: "translateX(3px)" },
          "60%": { transform: "translateX(-2px)" },
          "80%": { transform: "translateX(2px)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
        "fade-up-delay-1": "fade-up 0.6s ease-out 0.15s both",
        "fade-up-delay-2": "fade-up 0.6s ease-out 0.3s both",
        "fade-up-delay-3": "fade-up 0.6s ease-out 1.1s both",
        "title-bounce": "title-bounce 0.7s ease-out both",
        float: "float 6s ease-in-out infinite",
        "tile-pop": "tile-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both",
        "tile-swap": "tile-swap 0.25s ease-out",
        "tile-lock": "tile-lock 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "completion-glow": "completion-glow 0.8s ease-out both",
        "star-pop":
          "star-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) var(--star-delay, 0s) both",
        "overlay-in": "overlay-in 0.4s ease-out both",
        "tile-shake": "tile-shake 0.3s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};
