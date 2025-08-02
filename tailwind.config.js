/** @type {import('tailwindcss').Config} */
module.exports = {
    // Tell Tailwind where to look for class names so it doesn't purge them
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",  // your React components folder
      "./app/**/*.{js,jsx,ts,tsx}",  // if you use Next.js app directory
      // add any other folders where you have components
    ],
  
    darkMode: "class", // Enable toggling dark mode via the "dark" class
  
    theme: {
      extend: {
        // You can extend the theme here if you want to add custom colors, fonts, radii, etc.
        // For example, if you want to hook your CSS variables into Tailwind colors:
        colors: {
          primary: "var(--color-primary)",
          "primary-foreground": "var(--color-primary-foreground)",
          background: "var(--color-background)",
          foreground: "var(--color-foreground)",
          card: "var(--color-card)",
          "card-foreground": "var(--color-card-foreground)",
          // add others as needed
        },
        borderRadius: {
          md: "var(--radius-md)",
          lg: "var(--radius-lg)",
          xl: "var(--radius-xl)",
        },
      },
    },
  
    plugins: [
      require("tw-animate"), // if you use tw-animate plugin (based on your imports)
      // add other plugins here if used by shadcn or your project
    ],
  }
  