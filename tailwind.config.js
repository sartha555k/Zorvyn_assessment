import forms from '@tailwindcss/forms';
import containerQueries from '@tailwindcss/container-queries';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "error-dim": "#d7383b",
        "secondary-fixed": "#ffc3c0",
        "secondary-fixed-dim": "#ffafac",
        "on-primary-fixed-variant": "#006632",
        "on-primary-container": "#005b2c",
        "primary-dim": "#00ed7e",
        "inverse-surface": "#faf8ff",
        "tertiary-fixed": "#6ab6ff",
        "outline-variant": "#47474e",
        "surface-tint": "#a4ffb9",
        "on-tertiary": "#002e4f",
        "tertiary-dim": "#44a3f5",
        "surface-container-lowest": "#000000",
        "primary-fixed-dim": "#00ed7e",
        "on-tertiary-container": "#00223c",
        "tertiary-fixed-dim": "#4ba9fa",
        "inverse-on-surface": "#54545b",
        "surface-bright": "#2a2c34",
        "surface-container-highest": "#24252d",
        "primary-fixed": "#00fd87",
        "background": "#0d0e13",
        "surface-dim": "#0d0e13",
        "secondary-dim": "#ff706f",
        "on-background": "#f7f5fd",
        "secondary": "#ff706f",
        "on-surface": "#f7f5fd",
        "tertiary": "#5bb1ff",
        "surface-container-low": "#121319",
        "primary-container": "#00fd87",
        "on-primary-fixed": "#004621",
        "error": "#ff716c",
        "on-error": "#490006",
        "surface-container-high": "#1e1f26",
        "on-tertiary-fixed": "#00192f",
        "on-primary": "#006532",
        "surface": "#0d0e13",
        "on-secondary": "#490008",
        "tertiary-container": "#44a3f5",
        "surface-container": "#181920",
        "on-secondary-fixed": "#6f0011",
        "inverse-primary": "#006e37",
        "on-secondary-container": "#ffc1be",
        "on-secondary-fixed-variant": "#9a2128",
        "surface-variant": "#24252d",
        "primary": "#a4ffb9",
        "outline": "#75757c",
        "on-error-container": "#ffa8a3",
        "on-tertiary-fixed-variant": "#003c64",
        "on-surface-variant": "#abaab2",
        "error-container": "#9f0519",
        "secondary-container": "#8c1520"
      },
      fontFamily: {
        "headline": ["Plus Jakarta Sans"],
        "body": ["Plus Jakarta Sans"],
        "label": ["Space Grotesk"],
        "mono": ["DM Mono"]
      },
      borderRadius: {"DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px"},
    },
  },
  plugins: [
    forms,
    containerQueries
  ],
}
