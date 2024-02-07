import { type Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';

export default {
    content: ['./src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                'btn-grey': '#5F6172',
                'btn-blue': '#3D5AFE',
                'checked-color': '#37394F',
                'lines-color': '#AFB0B9',
                'placeholder-color': '#3D5AFE',
                'input-color': '#EBEBED',
                'error-color': '#F44336',
                'facebook-bg-color': '#1877F2',
                'header-blue': '#3D5AFE',
                'btn-green': '#2ECC71',
            },
            boxShadow: {
                '3xl': '0px 0px 25px 0px #00000033',
                'layer': '0 0 25px rgba(0, 0, 0, 0.2)',
            },
            fontFamily: {
                roboto: ['Roboto', ...fontFamily.sans],
            },
            width: {
                'popup': '31.875rem',
                'popup-buttons': '200px',
            },
            borderRadius: {
                'checkbox-raduis': '0.3rem',
                'popup': '0.625rem',
            },
            backgroundImage: {
                // eslint-disable-next-line quotes
                'checkmarker-image': "url('../shared/assets/icons/checkmarker.svg')",
            },
        },
    },
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    plugins: [require('@headlessui/tailwindcss')({ prefix: 'ui' })],
} satisfies Config;
