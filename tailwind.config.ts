import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
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
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
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
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Node category colors
        node: {
          input: "hsl(var(--node-input))",
          "input-bg": "hsl(var(--node-input-bg))",
          processing: "hsl(var(--node-processing))",
          "processing-bg": "hsl(var(--node-processing-bg))",
          analysis: "hsl(var(--node-analysis))",
          "analysis-bg": "hsl(var(--node-analysis-bg))",
          modeling: "hsl(var(--node-modeling))",
          "modeling-bg": "hsl(var(--node-modeling-bg))",
          timeseries: "hsl(var(--node-timeseries))",
          "timeseries-bg": "hsl(var(--node-timeseries-bg))",
          output: "hsl(var(--node-output))",
          "output-bg": "hsl(var(--node-output-bg))",
        },
        // Status colors
        status: {
          success: "hsl(var(--status-success))",
          warning: "hsl(var(--status-warning))",
          error: "hsl(var(--status-error))",
          pending: "hsl(var(--status-pending))",
          running: "hsl(var(--status-running))",
        },
        // Canvas
        canvas: {
          bg: "hsl(var(--canvas-bg))",
          grid: "hsl(var(--canvas-grid))",
          dot: "hsl(var(--canvas-dot))",
        },
        // Edges
        edge: {
          DEFAULT: "hsl(var(--edge-default))",
          selected: "hsl(var(--edge-selected))",
          animated: "hsl(var(--edge-animated))",
        },
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
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-in-left": {
          from: { transform: "translateX(-100%)", opacity: "0" },
          to: { transform: "translateX(0)", opacity: "1" },
        },
        "slide-in-right": {
          from: { transform: "translateX(100%)", opacity: "0" },
          to: { transform: "translateX(0)", opacity: "1" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-in-left": "slide-in-left 0.3s ease-out",
        "slide-in-right": "slide-in-right 0.3s ease-out",
        "pulse-soft": "pulse-soft 2s infinite",
      },
      boxShadow: {
        'node': '0 4px 12px rgba(0, 0, 0, 0.3)',
        'node-hover': '0 8px 24px rgba(0, 0, 0, 0.4)',
        'panel': '0 4px 20px rgba(0, 0, 0, 0.4)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
