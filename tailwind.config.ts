import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "xs": "510px",
        "2xl": "1400px",
      },
    },
    screens: {
      'xs': '475px',
      // => @media (min-width: 475px) { ... }

      'sm': '640px',
      // => @media (min-width: 640px) { ... }

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    },
    extend: {
      colors: {
        dark: {
          DEFAULT: '#FC8135', // Primary dark background
        },
        mainColor: "hsl(var(--main-color))",
        primary: "hsl(var(--primary))",
        whiteColor: "hsl(var(--white-color))",
        textColor: "hsl(var(--text-color))",
        textColor2: "hsl(var(--text-color-2))",
        redMediumColor: "hsl(var(--red-medium))",
        redDarkColor: "hsl(var(--red-dark))",
        redDarkColor2: 'hsl(var(--red-dark2))',
        lightRedColor: 'hsl(var(--light-red-color))',
        greenColor: 'hsl(var(--green-color))',
        footerTextColor: "hsl(var(--footer-link))",

        cardColor: "hsl(var(--card-color))",
        inputBorderColor: "hsl(var(--input-border-color))",
        strokeColor: "hsl(var(--stroke))",
        strokeColor2: "hsl(var(--stroke-2))",
        placeholderColor: "hsl(var(--placeholder))",
        inputSearchColor: 'hsl(var(--input-search-table))',
        greyColor: 'hsl(var(--grey-color))',

        switchBackground: "hsl(var(--switch-background))",
        switchBorder: "hsl(var(--switch-border))",

        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        sidebarColor: "hsl(var(--sidebar-color))",
        authBackground: "hsl(var(--auth-background))",

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
      boxShadow: {
        "card-auth-shadow": "0 4px 36px 0 rgba(0, 0, 0, 0.1)",
      },
      borderRadius: {
        xl: "var(--radius)",
        lg: "calc(var(--radius) - 1px)",
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
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        'shimmer-slow': 'shimmer 2s linear infinite',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
