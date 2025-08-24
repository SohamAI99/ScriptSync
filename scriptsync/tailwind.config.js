/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
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
        border: "var(--color-border)", /* subtle glass border */
        input: "var(--color-input)", /* glass input background */
        ring: "var(--color-ring)", /* neon cyan */
        background: "var(--color-background)", /* deep navy */
        foreground: "var(--color-foreground)", /* high-contrast white-blue */
        primary: {
          DEFAULT: "var(--color-primary)", /* neon cyan */
          foreground: "var(--color-primary-foreground)", /* deep navy */
        },
        secondary: {
          DEFAULT: "var(--color-secondary)", /* vibrant purple */
          foreground: "var(--color-secondary-foreground)", /* high-contrast white-blue */
        },
        destructive: {
          DEFAULT: "var(--color-destructive)", /* clear red */
          foreground: "var(--color-destructive-foreground)", /* high-contrast white-blue */
        },
        muted: {
          DEFAULT: "var(--color-muted)", /* glass surface */
          foreground: "var(--color-muted-foreground)", /* muted blue-gray */
        },
        accent: {
          DEFAULT: "var(--color-accent)", /* success green */
          foreground: "var(--color-accent-foreground)", /* deep navy */
        },
        popover: {
          DEFAULT: "var(--color-popover)", /* enhanced glass */
          foreground: "var(--color-popover-foreground)", /* high-contrast white-blue */
        },
        card: {
          DEFAULT: "var(--color-card)", /* glass surface */
          foreground: "var(--color-card-foreground)", /* high-contrast white-blue */
        },
        success: {
          DEFAULT: "var(--color-success)", /* success green */
          foreground: "var(--color-success-foreground)", /* deep navy */
        },
        warning: {
          DEFAULT: "var(--color-warning)", /* warm amber */
          foreground: "var(--color-warning-foreground)", /* deep navy */
        },
        error: {
          DEFAULT: "var(--color-error)", /* clear red */
          foreground: "var(--color-error-foreground)", /* high-contrast white-blue */
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        'heading': ['Poppins', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
        'caption': ['Source Sans 3', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      backdropBlur: {
        'xs': '2px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      zIndex: {
        '100': '100',
        '200': '200',
        '1000': '1000',
        '1001': '1001',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}