import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/**/*.blade.php',
        './resources/**/*.js',
        './resources/**/*.vue',
        './resources/**/*.tsx',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            backgroundImage: {
                'userName':         "url('/public/storage/image/SidebarTab/StillinLove.png')",
                'Logout':           "url('/public/storage/image/SidebarTab/SilenceSuzuka.PNG')",
            },
        },
    },
    plugins: [
        require('tailwind-scrollbar-hide'),
    ],
};
