/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: '#000000',
        canvas: '#ffffff',
        'surface-soft': '#f7f7f5',
        hairline: '#e6e6e6',
        'block-lime': '#dceeb1',
        'block-lilac': '#c5b0f4',
        'block-navy': '#1f1d3d',
        'block-cream': '#f4ecd6',
        'block-coral': '#f3c9b6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        pill: '50px',
      },
      spacing: {
        section: '96px',
      },
    },
  },
  plugins: [],
}
