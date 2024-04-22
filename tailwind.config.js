/** @type {import('tailwindcss').Config} */

const plugin = require('tailwindcss/plugin');

export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                gray: {
                    900: '#13131a',
                    800: '#16161f',
                    700: '#1c1c27',
                    600: '#22222f',
                    500: '#3b3b54',
                    400: '#7f7f98',
                    300: '#ababc4',
                    200: '#bfbfd4',
                    100: '#fafafa',
                },
                blue: {
                    light: '#8fb2f5',
                },
            },
            fontSize: {
                lg: ['20px', '140%'],
                md: ['16px', '140%'],
                sm: ['14px', '140%'],
                xs: ['12px', '140%'],
            },
            backgroundImage: {
                compass: "url('/src/assets/Compass.png')",
                'compass-arrow': "url('/src/assets/CompassArrow.png')",
                'day-clear': "url('/src/assets/bg/DayClear.png')",
                'icon-nfc': "url('/src/assets/icons/NightFewClouds.svg')",
            },
        },
    },
    plugins: [
        plugin(function ({ addUtilities }) {
            addUtilities({
                '.heading-hg': {
                    'font-size': '96px',
                    'line-height': '100%',
                    'font-weight': '800',
                },
                '.heading-xl': {
                    'font-size': '48px',
                    'line-height': '120%',
                    'font-weight': '800',
                },
                '.heading-lg': {
                    'font-size': '32px',
                    'line-height': '140%',
                    'font-weight': '700',
                },
                '.heading-md': {
                    'font-size': '20px',
                    'line-height': '140%',
                    'font-weight': '700',
                },
                '.heading-sm': {
                    'font-size': '16px',
                    'line-height': '140%',
                    'font-weight': '700',
                },
                '.heading-xs': {
                    'font-size': '14px',
                    'line-height': '140%',
                    'font-weight': '700',
                },
                '.blue-light': {
                    color: '#8FB2F5',
                },
                '.gray-900': {},
            });
        }),
    ],
};
