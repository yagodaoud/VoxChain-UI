/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'govbr-blue-warm-vivid-70': '#1351B4',
                'govbr-blue-warm-vivid-80': '#0c3d8a',
                'govbr-blue-warm-20': '#E6F1FF',
                'govbr-pure-100': '#071D41',
            },
        },
    },
    plugins: [],
}
