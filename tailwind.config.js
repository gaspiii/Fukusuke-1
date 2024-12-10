/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    daisyui: {
    themes: [
      {
        mytheme: {
          
"primary": "#ff0000",
          
"secondary": "#c2410c",
          
"accent": "#9f1239",
          
"neutral": "#1f2937",
          
"base-100": "#1f2937",
          
"info": "#ff0000",
          
"success": "#ff0000",
          
"warning": "#d6d3d1",
          
"error": "#ff0000",
          },
        },
      ],
    },
  },
  plugins: [
    require('daisyui'), 

  ],
}