import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
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
        background: "oklch(var(--background))",
        foreground: "oklch(var(--foreground))",
        
        primary: {
          DEFAULT: "oklch(var(--primary))",
          foreground: "oklch(var(--primary-foreground))",
          50: "#f3f3ff",
          100: "#e9e7ff",
          200: "#d4d1ff",
          300: "#b3acff",
          400: "#907bff",
          500: "#7068F4", // Our primary purple
          600: "#5b45ee",
          700: "#4a31d2",
          800: "#3f2aad",
          900: "#34258b",
        },
        secondary: {
          DEFAULT: "oklch(var(--secondary))",
          foreground: "oklch(var(--secondary-foreground))",
          50: "#fff1f8",
          100: "#ffe5f4",
          200: "#ffccea",
          300: "#ffa3d6",
          400: "#ff82c5",
          500: "#FF64B4", // Our secondary pink
          600: "#ff3090",
          700: "#f4196e",
          800: "#cc1259",
          900: "#ab124d",
        },
        accent: {
          DEFAULT: "oklch(var(--accent))",
          foreground: "oklch(var(--accent-foreground))",
          50: "#fffbeb",
          100: "#fff4d3",
          200: "#ffe7a6",
          300: "#ffd570",
          400: "#ffbd43",
          500: "#ffac4c", // Our accent orange
          600: "#fb8d00",
          700: "#e76a00",
          800: "#bf5308",
          900: "#9c450c",
        },
        muted: {
          DEFAULT: "oklch(var(--muted))",
          foreground: "oklch(var(--muted-foreground))",
        },
        destructive: {
          DEFAULT: "oklch(var(--destructive))",
          foreground: "oklch(var(--destructive-foreground))",
        },
        card: {
          DEFAULT: "oklch(var(--card))",
          foreground: "oklch(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "oklch(var(--popover))",
          foreground: "oklch(var(--popover-foreground))",
        },
        
        border: "oklch(var(--border))",
        input: "oklch(var(--input))",
        ring: "oklch(var(--ring))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        sway: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 15px 0 rgba(112, 104, 244, 0.4)' },
          '50%': { boxShadow: '0 0 30px 5px rgba(112, 104, 244, 0.7)' },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "float": "float 6s ease-in-out infinite",
        "sway": "sway 8s ease-in-out infinite",
        "shimmer": "shimmer 8s ease-in-out infinite",
        "pulse": "pulse 3s ease-in-out infinite",
        "glow": "glow 4s ease-in-out infinite",
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 0deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
